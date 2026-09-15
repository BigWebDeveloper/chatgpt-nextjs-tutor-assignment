import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),

        quantity: z
          .number()
          .int("Quantity must be an integer")
          .positive("Quantity must be greater than 0"),
      }),
    )
    .min(1, "Order must contain at least one item"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export function createOrderVerify(data: unknown) {
  const result = createOrderSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message;

    return {
      success: false,
      error: Response.json(
        {
          error: firstError,
        },
        {
          status: 400,
        },
      ),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
