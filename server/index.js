const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const categoryRouter = require("./routes/categories");
const productRouter = require("./routes/products");
const bagRouter = require("./routes/bag");
const orderRouter = require("./routes/orders");

const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());

app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/bag", bagRouter);
app.use("/orders", orderRouter);

const url = "mongodb://0.0.0.0:27017/shop";

mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

app.listen(3000);
