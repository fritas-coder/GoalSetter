const express = require("express");
require("dotenv").config();
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

const port = process.env.PORT || 4000;

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
