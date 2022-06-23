const request = require("supertest");
const app = require("../../main");
const newProduct = require("../data/new-product.json");
const errorData = require("../data/error-data.json");

let firstProduct;

it("POST /api/products", async () => {
  const response = await request(app).post("/api/product").send(newProduct);
  expect(response.statusCode).toBe(201);
  expect(response.body.name).toBe(newProduct.name);
  expect(response.body.description).toBe(newProduct.description);
  expect(response.body.price).toBe(newProduct.price);
});

it("should return 500 on POST /api/product", async () => {
  const response = await request(app).post("/api/product").send(errorData);
  expect(response.statusCode).toBe(500);
  expect(response.body).toStrictEqual({
    message:
      "Product validation failed: description: Path `description` is required.",
  });
});

it("GET /api/product", async () => {
  const response = await request(app).get("/api/product");
  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body[0].name).toBeDefined();
  expect(response.body[0].description).toBeDefined();
  expect(response.body[0].price).toBeDefined();
  firstProduct = response.body[0];
});

it("GET /api/product/:productId", async () => {
  const response = await request(app).get("/api/product/" + firstProduct._id);
  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe(firstProduct.name);
  expect(response.body.description).toBe(firstProduct.description);
  expect(response.body.price).toBe(firstProduct.price);
});

it("GET /api/product/:productId (doesnt exsit)", async () => {
  const response = await request(app).get(
    "/api/product/62b40f144699bae9886e8d55"
  );
  expect(response.statusCode).toBe(404);
});
