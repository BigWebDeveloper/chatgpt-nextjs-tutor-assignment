import mongoose from "mongoose";
import Order from "../models/order";
import OrderItem from "../models/orderItem";
import Product from "../models/Product";
import { CreateOrderInput } from "../lib/zod/validations/order";

export async function createOrderService(
  userId: string,
  data: CreateOrderInput,
) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /*
     * --------------------------------------------------
     * 1. Combine duplicate products
     * --------------------------------------------------
     *
     * Example:
     *
     * product A → quantity 2
     * product A → quantity 3
     *
     * becomes:
     *
     * product A → quantity 5
     */

    const quantityMap = new Map<string, number>();
    for (const item of data.items) {
      const currentQuantity = quantityMap.get(item.product) ?? 0;

      quantityMap.set(item.product, currentQuantity + item.quantity);
    }

    const normalizedItems = Array.from(quantityMap.entries()).map(
      ([product, quantity]) => ({
        product,
        quantity,
      }),
    );

    /*
     * --------------------------------------------------
     * 2. Get unique product IDs
     * --------------------------------------------------
     */

    const productIds = normalizedItems.map((item) => item.product);

    /*
     * --------------------------------------------------
     * 3. Find products
     * --------------------------------------------------
     */

    const products = await Product.find({
      _id: {
        $in: productIds,
      },
    }).session(session);

    /*
     * --------------------------------------------------
     * 4. Confirm every product exists
     * --------------------------------------------------
     */

    if (products.length !== productIds.length) {
      await session.abortTransaction();

      return {
        success: false,
        status: 404,
        message: "One or more products were not found",
      };
    }

    /*
     * --------------------------------------------------
     * 5. Create a quick product lookup map
     * --------------------------------------------------
     */

    const productMap = new Map(
      products.map((product) => [product._id.toString(), product]),
    );

    /*
     * --------------------------------------------------
     * 6. Calculate total using DATABASE prices
     * --------------------------------------------------
     */

    let total = 0;

    const orderItemsData = [];

    for (const item of normalizedItems) {
      const product = productMap.get(item.product);

      if (!product) {
        await session.abortTransaction();

        return {
          success: false,
          status: 404,
          message: "Product not found",
        };
      }

      /*
       * IMPORTANT:
       *
       * We do NOT use a price supplied by the client.
       */

      const price = product.price;

      total += price * item.quantity;

      orderItemsData.push({
        product: product._id,
        quantity: item.quantity,
        price,
      });
    }

    /*
     * --------------------------------------------------
     * 7. Create OrderItems
     * --------------------------------------------------
     */

    const createdOrderItems = await OrderItem.create(orderItemsData, {
      session,
    });

    /*
     * --------------------------------------------------
     * 8. Create Order
     * --------------------------------------------------
     */

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: createdOrderItems.map((item) => item._id),
          total,
          status: "pending",
        },
      ],
      {
        session,
      },
    );

    /*
     * --------------------------------------------------
     * 9. Reduce stock atomically
     * --------------------------------------------------
     */

    for (const item of normalizedItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,

          /*
           * This prevents the stock from
           * becoming negative.
           */
          stock: {
            $gte: item.quantity,
          },
        },
        {
          $inc: {
            stock: -item.quantity,
          },
        },
        {
          new: true,
          session,
        },
      );

      /*
       * If null is returned, the stock wasn't
       * sufficient at the moment of update.
       */

      if (!updatedProduct) {
        throw new Error("Insufficient stock for one or more products");
      }
    }

    /*
     * --------------------------------------------------
     * 10. Update inStock
     * --------------------------------------------------
     */

    for (const item of normalizedItems) {
      await Product.updateOne(
        {
          _id: item.product,
        },
        [
          {
            $set: {
              inStock: {
                $gt: ["$stock", 0],
              },
            },
          },
        ],
        {
          session,
        },
      );
    }

    /*
     * --------------------------------------------------
     * 11. Commit transaction
     * --------------------------------------------------
     */

    await session.commitTransaction();

    /*
     * --------------------------------------------------
     * 12. Return result
     * --------------------------------------------------
     */

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "-password")
      .populate({
        path: "items",
        populate: {
          path: "product",
        },
      });

    return {
      success: true,
      status: 201,
      message: "Order created successfully",
      data: populatedOrder,
    };
  } catch (error) {
    /*
     * If anything fails, undo ALL
     * transaction operations.
     */

    await session.abortTransaction();

    throw error;
  } finally {
    /*
     * Always close the session.
     */

    await session.endSession();
  }
}
