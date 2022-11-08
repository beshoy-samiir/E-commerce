const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const hbs = require("hbs");
app.use(cors());
app.use(express.json());
require("dotenv").config();
require("../Models/Connection/databaseConnection");

app.set("view engine", "hbs");

const userRoute = require("../routes/user.routes.js");
app.use("/api/user", userRoute);
const AdminRoutes = require("../routes/Admin.routes.js");
app.use("/api/Admin", AdminRoutes);
const SuperAdminRoutes = require("../routes/SuperAdmin.routes.js");

app.use("/api/SuperAdmin", SuperAdminRoutes);
module.exports = app;
//http://localhost/5000/api/user/home
