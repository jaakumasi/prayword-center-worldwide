import { NODE_ENV, PORT } from "./constants";
import express from "express";
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));


app.listen(process.env[PORT] || 38388 || 50060,
    () => process.env[NODE_ENV] === "development" ? console.log("listening...") : ""
);
