import { Request, Response } from "express";
import Product from "../models/product";

type ProductFormData = {
    name?: string;
    categories?: string;
    price?: number;
    stock?: number;
}

export const products_get = (req: Request, res: Response) => {
    const query = req.query.category ?
        { categories: req.query.category } : {}

    Product.find(query)
        .then(products => {
            res.send(products);
        })
        .catch(err => {
            console.error("products_get error", err);
            res.status(501).json({ error: "internal server error" });
        });
}

export const products_get_id = (req: Request, res: Response) => {
    const id = req.params.id;

    Product.findById(id)
        .then(product => {
            if (!product) {
                res.status(404).json({ error: "product not found" });
                return;
            }
            return res.send(product);
        })
        .catch(err => {
            console.error("products_get_id error", err);
            res.status(500).json({ error: "internal server error" });
        });
}

export const products_post = (req: Request<{}, {}, ProductFormData>, res: Response) => {
    const { name, categories, price, stock } = req.body;
    if (!name || !categories || !price || !stock) {
        res.status(400).json({ error: "invalid form data"});
        return;
    }

    Product.create({
        name,
        categories: categories
            .split(",")
            .map(category => category.trim())
            .filter(category => category !== ""),
        price,
        stock,
    })
        .then(_ => res.json({ ok: "product added" }))
        .catch(err => {
            console.error("products_post error", err);
            res.status(501).json({ error: "internal server error" });
        });
}

export const products_put = (req: Request<{ id: string }, {}, ProductFormData>, res: Response) => {
    const id = req.params.id;
    const { name, categories, price, stock } = req.body;
    if (!name || !categories || !price || !stock) {
        res.status(400).json({ error: "invalid form data" });
        return;
    }

    Product.findByIdAndUpdate(id, {
        name,
        categories: categories
            .split(",")
            .map(category => category.trim())
            .filter(category => category !== ""),
        price,
        stock,
    })
        .then(_ => res.json({ ok: "product updated" }))
        .catch(err => {
            console.error("products_put error", err);
            res.status(501).json({ error: "internal server error" })
        });
}

export const products_delete = (req: Request, res: Response) => {
    const id = req.params.id;

    Product.findByIdAndDelete(id)
        .then(_ => res.json({ ok: "product deleted" }))
        .catch(err => res.status(501).json({ error: "internal server error" }));
}
