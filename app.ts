import express from "express";
import mongoose from "mongoose";
import router from "./routes/apiRoutes";

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

const dbUri = "mongodb://127.0.0.1:27017/store";
const port = 3000;

mongoose.connect(dbUri)
    .then(() => {
        console.log("connected to", dbUri);
        app.listen(port, () => {
            console.log(`listening on http://localhost:${port}`);
        });
    })
    .catch(err => console.error("error connecting to db:", err));

app.use((req, res, next) => {
    console.log(req.method, req.url, req.body);
    next();
});

app.use("/api", router);

app.get("/", (req, res) => {
    res.render("product-grid", { category: null });
});

app.get("/category/:category", (req, res) => {
    res.render("product-grid", { category: req.params.category });
});

app.get("/add", (req, res) => {
    res.render("add-product");
});

app.get("/edit/:id", (req, res) => {
    res.render("edit-product", { id: req.params.id });
});

app.use((req, res) => {
    res.render("404");
});
