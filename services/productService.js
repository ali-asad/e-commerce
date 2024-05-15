const { sendResponse } = require("../utils");
const supabase = require("../superbaseInit");

async function createProduct(req, res) {
  const { name, description, price, category } = req.body;
  const { data, error } = await supabase
    .from("products")
    .insert([{ name, description, price, category }])
    .select("*");

  if (error)
    return sendResponse(res, 400, "Product creation failed", null, error);

  const productData = {
    id: data[0].id,
    name: data[0].name,
    description: data[0].description,
    price: data[0].price,
    category: data[0].category,
  };

  return sendResponse(res, 200, "Product created successfully", productData);
}

async function getProducts(req, res) {
  const { category } = req.query;
  const query = supabase.from("products").select("*");
  if (category) {
    query.eq("category", category);
  }
  const { data, error } = await query;

  if (error)
    return sendResponse(res, 400, "Failed to retrieve products", null, error);
  return sendResponse(res, 200, "Products retrieved successfully", data);
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("products")
    .update(req.body)
    .match({ id });
  if (error)
    return sendResponse(res, 400, "Failed to update product", null, error);
  return sendResponse(res, 200, "Product updated successfully");
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("products")
    .delete()
    .match({ id });

  if (error)
    return sendResponse(res, 400, "Failed to delete product", null, error);
  return sendResponse(res, 200, "Product deleted successfully", data);
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
