import { NODE_ENV, PORT } from "./constants";
import express from "express";
import { authenticate, dbConnect } from "./middleware";
import { assembly, login } from "./routes";
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(dbConnect);
app.use(authenticate);

app.post("/login", login);
app.all("/assembly", assembly);


app.listen(process.env[PORT] || 38388 || 50060,
    () => process.env[NODE_ENV] === "development" ? console.log("listening...") : ""
);
