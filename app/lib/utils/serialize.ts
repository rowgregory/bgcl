export const serializeOrder = (order: any) => ({
  ...order,
  totalAmount: Number(order.totalAmount),
  feesCovered: order.feesCovered != null ? Number(order.feesCovered) : null,
  createdAt: order.createdAt.toISOString()
})
