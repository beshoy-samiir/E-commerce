/* de framework to handle req w a2dr a7ot middleware*/ 
const express = require("express");
const app = express();

const cors = require("cors");

const path = require("path");

const dirPath = path.join(__dirname, '../routes');
console.log(__dirname)

app.use(cors());


app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

require("dotenv").config();
require("../Models/Connection/databaseConnection");



const userRoute = require(`${dirPath}/user.routes`);
app.use("/api/user", userRoute);
const AdminRoutes = require(`${dirPath}/admin.routes`);
app.use("/api/Admin", AdminRoutes);
const SuperAdminRoutes = require(`${dirPath}/superAdmin.routes`);

app.use("/api/SuperAdmin", SuperAdminRoutes);
module.exports = app;
