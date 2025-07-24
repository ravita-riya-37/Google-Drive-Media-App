const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const fileRoutes = require("./routes/fileRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/files", fileRoutes);

module.exports = app;


