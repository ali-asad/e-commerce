const { sendResponse } = require("../utils");
const supabase = require("../superbaseInit");

async function createCart(req, res) {
  const user_id = req.user.id;
  const { data, error } = await supabase.from("carts").insert([{ user_id }]);
  if (error)
    return sendResponse(res, 400, "Failed to create cart", null, error);
  return sendResponse(res, 200, "Cart created successfully", data);
}

async function addToCart(req, res) {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  let { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user_id)
    .single();

  if (cartError || !cart) {
    let creation = await supabase.from("carts").insert([{ user_id }]);
    if (creation.error || !creation.data) {
      return sendResponse(
        res,
        400,
        "Failed to create a cart",
        null,
        creation.error?.message || "No data returned"
      );
    }
    cart = creation.data[0];
  }

  const { error } = await supabase
    .from("cart_items")
    .upsert([{ cart_id: cart.id, product_id, quantity }], {
      onConflict: "cart_id, product_id",
    });

  if (error) {
    return sendResponse(res, 400, "Failed to add item to cart", null, error);
  }

  return sendResponse(res, 200, "Item added to cart successfully", {
    cart_id: cart.id,
    product_id,
    quantity,
  });
}

async function removeFromCart(req, res) {
  const { product_id } = req.body;
  const user_id = req.user.id;

  const { data: cartData, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user_id)
    .single();

  if (cartError || !cartData) {
    return sendResponse(
      res,
      400,
      "No cart found for this user",
      null,
      cartError || "Cart not found"
    );
  }

  const { data: deletedData, error: deleteError } = await supabase
    .from("cart_items")
    .delete()
    .match({ product_id, cart_id: cartData.id });

  console.log(deletedData);

  if (deleteError) {
    return sendResponse(
      res,
      400,
      "Failed to remove item from cart",
      null,
      deleteError
    );
  }

  if (!deletedData) {
    return sendResponse(
      res,
      404,
      "No item found to delete or already removed",
      null
    );
  }

  return sendResponse(
    res,
    200,
    "Item removed from cart successfully",
    deletedData
  );
}

async function getCart(req, res) {
  const user_id = req.user.id;

  const { data: cartData, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user_id)
    .single();

  if (cartError || !cartData) {
    return sendResponse(
      res,
      400,
      "Failed to find user's cart",
      null,
      cartError || "No cart found for user"
    );
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      product:product_id (id, name, price)
    `
    )
    .eq("cart_id", cartData.id); // Use the retrieved cart_id

  if (itemsError) {
    return sendResponse(res, 400, "Failed to get cart items", null, itemsError);
  }

  return sendResponse(res, 200, "Cart items retrieved successfully", itemsData);
}

module.exports = {
  createCart,
  addToCart,
  removeFromCart,
  getCart,
};
