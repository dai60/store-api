import express from "express";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import Product from "./models/product";
import router from "./routes/apiRoutes";

vi.mock("./models/product");

let app: express.Express;

beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api", router);
});

beforeEach(() => {
    vi.resetAllMocks();
});

const mockValues = [
    { _id: 1, "name": "Laptop", "price": 999.99, "stock": 12, "categories": ["Computers", "Electronics", "Work"] },
    { _id: 2, "name": "Smartphone", "price": 499.99, "stock": 45, "categories": ["Mobile Phones", "Electronics", "Communication"] },
    { _id: 3, "name": "Tablet", "price": 299.99, "stock": 20, "categories": ["Mobile Devices", "Electronics", "Entertainment"] },
];

describe("GET", () => {
    it("get all products", async () => {
        vi.mocked(Product.find).mockResolvedValue(mockValues);

        const res = await request(app).get("/api/products");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockValues);
        expect(Product.find).toHaveBeenCalledExactlyOnceWith({});
    });

    it("get all products of category", async () => {
        vi.mocked(Product.find).mockResolvedValue(mockValues);

        const res = await request(app).get("/api/products?category=Electronics");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockValues);
        expect(Product.find).toHaveBeenCalledExactlyOnceWith({ categories: "Electronics" });
    });

    it("get product by id", async () => {
        vi.mocked(Product.findById).mockResolvedValue(mockValues[0]);

        const res = await request(app).get("/api/products/1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockValues[0]);
        expect(Product.findById).toHaveBeenCalledExactlyOnceWith("1");
    });

    it("get product by id not found", async () => {
        vi.mocked(Product.findById).mockResolvedValue(null);

        const res = await request(app).get("/api/products/404");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "product not found" });
        expect(Product.findById).toHaveBeenCalledExactlyOnceWith("404");
    });

    it("get error", async () => {
        vi.mocked(Product.find).mockRejectedValue(new Error("db error"));

        const res = await request(app).get("/api/products");

        expect(res.status).toBe(501);
        expect(res.body).toEqual({ error: "internal server error" });
        expect(Product.find).toHaveBeenCalledOnce();
    });
});

describe("POST", () => {
    const postMockValue = {
        name: "Laptop",
        categories: "Computers, Electronics, Work",
        price: 999.99,
        stock: 12,
    };

    it("add new product", async () => {
        vi.mocked(Product.create).mockResolvedValue(null!);

        const res = await request(app)
            .post("/api/products")
            .send(postMockValue);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ok: "product added" });
        expect(Product.create).toHaveBeenCalledExactlyOnceWith({
            name: "Laptop",
            categories: ["Computers", "Electronics", "Work"],
            price: 999.99,
            stock: 12,
        });
    });

    it("add new product invalid data", async () => {
        vi.mocked(Product.create).mockResolvedValue(null!);

        const res = await request(app)
            .post("/api/products")
            .send({ name: postMockValue.name, categories: postMockValue.categories, price: postMockValue.price });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "invalid form data" });
        expect(Product.create).not.toHaveBeenCalled();
    });

    it("add new product error", async () => {
        vi.mocked(Product.create).mockRejectedValue(new Error("db error"));

        const res = await request(app)
            .post("/api/products")
            .send(postMockValue);

        expect(res.status).toBe(501);
        expect(res.body).toEqual({ error: "internal server error" });
        expect(Product.create).toHaveBeenCalledOnce();
    });
});

describe("PUT", () => {
    const putMockValue = {
        name: "Laptop",
        categories: "Computers, Electronics, Work",
        price: 999.99,
        stock: 12,
    };

    it("update product", async () => {
        vi.mocked(Product.findByIdAndUpdate).mockResolvedValue(null);

        const res = await request(app)
            .put("/api/products/1")
            .send(putMockValue);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ok: "product updated" });
        expect(Product.findByIdAndUpdate).toHaveBeenCalledExactlyOnceWith("1", {
            name: "Laptop",
            categories: ["Computers", "Electronics", "Work"],
            price: 999.99,
            stock: 12,
        });
    });

    it("update product invalid data", async () => {
        vi.mocked(Product.findByIdAndUpdate).mockResolvedValue(null);

        const res = await request(app)
            .put("/api/products/1")
            .send({ name: putMockValue.name, categories: putMockValue.categories, price: putMockValue.price });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "invalid form data" });
        expect(Product.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("update product error", async () => {
        vi.mocked(Product.findByIdAndUpdate).mockRejectedValue(new Error("db error"));

        const res = await request(app)
            .put("/api/products/1")
            .send(putMockValue);

        expect(res.status).toBe(501);
        expect(res.body).toEqual({ error: "internal server error" });
        expect(Product.findByIdAndUpdate).toHaveBeenCalledOnce();
    });
});

describe("DELETE", () => {
    it("delete product by id", async () => {
        vi.mocked(Product.findByIdAndDelete).mockResolvedValue(null);

        const res = await request(app).delete("/api/products/1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ok: "product deleted" });
        expect(Product.findByIdAndDelete).toHaveBeenCalledExactlyOnceWith("1");
    });

    it("delete error", async () => {
        vi.mocked(Product.findByIdAndDelete).mockRejectedValue(new Error("db error"));

        const res = await request(app).delete("/api/products/1");

        expect(res.status).toBe(501);
        expect(res.body).toEqual({ error: "internal server error" });
        expect(Product.findByIdAndDelete).toHaveBeenCalledExactlyOnceWith("1");
    });
});
