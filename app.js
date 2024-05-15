const express = require("express");
require("dotenv").config();
require("express-async-errors");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
require("./routes")(app);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
