require("dotenv").config();
const express = require("express");
const cors = require("cors");

const ocrRoutes = require("./routes/ocr.routes");
const letterRoutes = require("./routes/letter.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/ocr", ocrRoutes);

app.use("/api/letters", letterRoutes);

app.listen(3000, () => {
  console.log("Server running: http://localhost:3000");
});