import { connectDB } from "@/app/lib/mongodb";
import Product from "@/app/models/Product";
import OrderItem from "@/app/models/orderItem";
import Order from "@/app/models/order";

interface OrderInputItem {
  product: string;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      user,
      items,
    }: {
      user: string;
      items: OrderInputItem[];
    } = body;

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Order must contain at least one item",
        },
        {
          status: 400,
        },
      );
    }
    let total = 0;

    const orderItemsData = [];

    for (const item of items) {
      if (!item.product || item.quantity < 1) {
        return Response.json(
          {
            success: false,
            message: "Invalid order item",
          },
          {
            status: 400,
          },
        );
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return Response.json(
          {
            success: false,
            message: `Product ${item.product} not found`,
          },
          {
            status: 404,
          },
        );
      }

      if (!product.inStock) {
        return Response.json(
          {
            success: false,
            message: `${product.name} is out of stock`,
          },
          {
            status: 400,
          },
        );
      }

      const itemTotal = product.price * item.quantity;

      total += itemTotal;

      orderItemsData.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      user,
      total,
      status: "pending",
      items: [],
    });

    const orderItems = await OrderItem.insertMany(
      orderItemsData.map((item) => ({
        ...item,
        order: order._id,
      })),
    );

    order.items = orderItems.map((item) => item._id);

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name price image category",
        },
      });

    return Response.json(
      {
        success: true,
        message: "Order created successfully",
        data: populatedOrder,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Create order error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create order",
      },
      {
        status: 500,
      },
    );
  }
}
