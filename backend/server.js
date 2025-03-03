require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const scoreRoutes = require("./routes/scoreRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.use("/api/scores", scoreRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
