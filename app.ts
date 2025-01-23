import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import router from "./routes/apiRoutes";

if (!process.env.URI) {
    console.error("URI must be set in .env");
    process.exit(1);
}
if (!process.env.PORT) {
    console.error("PORT must be set in .env");
    process.exit(1);
}

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

mongoose.connect(process.env.URI)
    .then(() => {
        console.log("connected to", process.env.URI);
        app.listen(process.env.PORT, () => {
            console.log(`listening on http://localhost:${process.env.PORT}`);
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
