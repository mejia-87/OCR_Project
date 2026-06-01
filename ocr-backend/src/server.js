const express = require("express");
const cors = require("cors");

const ocrRoutes = require("./routes/ocr.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/ocr", ocrRoutes);

app.listen(3000, () => {
  console.log("Server running: http://localhost:3000");
});