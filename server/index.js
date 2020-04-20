const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const categoryRouter = require("./routes/categories");
const productRouter = require("./routes/products");
const bagRouter = require("./routes/bag");
const orderRouter = require("./routes/orders");
const userRouter = require("./routes/users");
const mainRouter = require("./routes/mainRouter");


const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");


const initializePassport = require("./passport");
initializePassport(passport);



const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());

app.use(flash());
app.use(session({
	secret: "ne vsem",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use(express.static(`${__dirname}/public`));
app.set("views", `${__dirname}/public/views`);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", mainRouter);


app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/bag", bagRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);

const url = "mongodb://0.0.0.0:27017/shop";

mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

app.listen(3000);
