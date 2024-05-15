const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const supabase = require("../superbaseInit");
const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res) {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("users")
      .insert({ username, password_hash: hashedPassword, email })
      .select("*");

    if (error) throw error;

    res
      .status(201)
      .send({ message: "User registered successfully", userId: data[0].id });
  } catch (err) {
    res
      .status(400)
      .send({ message: "Failed to register user", error: err.message });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error) throw error;

    const validPassword = await bcrypt.compare(password, data.password_hash);
    if (!validPassword) throw new Error("Invalid credentials");

    // Update last login before issuing the token
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("users")
      .update({ last_login: now })
      .eq("id", data.id);

    if (updateError) throw updateError;

    const payload = { id: data.id, username: data.username };
    const token = jwt.encode(payload, JWT_SECRET);

    res.send({ message: "Login successful", token });
  } catch (err) {
    res.status(401).send({ message: "Login failed", error: err.message });
  }
}

async function getUserInfo(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = jwt.decode(token, JWT_SECRET);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (error) throw error;

    res.send({ user: data });
  } catch (err) {
    res
      .status(401)
      .send({ message: "Failed to authenticate token", error: err.message });
  }
}

module.exports = {
  register,
  login,
  getUserInfo,
};
