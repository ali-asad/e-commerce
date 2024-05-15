const { sendResponse } = require("../utils");
const supabase = require("../superbaseInit");

async function placeOrder(req, res) {
  const { user_id } = req.user;
  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select("product_id, quantity, products(price)")
    .eq("cart_id", user_id); // Assuming cart_id is same as user_id

  if (cartError)
    return sendResponse(
      res,
      400,
      "Failed to retrieve cart items",
      null,
      cartError
    );

  const total_cost = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.products.price,
    0
  );
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert([{ user_id, total_cost }]);

  if (orderError)
    return sendResponse(res, 400, "Failed to place order", null, orderError);

  // Clear the cart after placing the order
  const { error: clearError } = await supabase
    .from("cart_items")
    .delete()
    .match({ cart_id: user_id });
  if (clearError) console.error("Failed to clear cart");

  return sendResponse(res, 200, "Order placed successfully", {
    orderData,
    total_cost,
  });
}

async function getOrder(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
              id,
              total_cost,
              created_at,
              items:orders_products(order_id, quantity, product:product_id(name, price))
          `
    )
    .eq("id", id)
    .single();

  if (error)
    return sendResponse(res, 400, "Failed to get order details", null, error);
  return sendResponse(res, 200, "Order details retrieved successfully", data);
}

module.exports = {
  placeOrder,
  getOrder,
};
