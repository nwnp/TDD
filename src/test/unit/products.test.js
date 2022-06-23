const productService = require("../../services/api.service");
const productModel = require("../../models/Product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");
const allProducts = require("../data/all-products.json");

productModel.create = jest.fn(); // create mock function
productModel.find = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("Product POST", () => {
  beforeEach(() => {
    req.body = newProduct;
  });

  it("should have ad createProduct funciton", () => {
    expect(typeof productService.createProduct).toBe("function");
  });

  it("should call ProductModel.create", async () => {
    await productService.createProduct(req, res, next);
    expect(productModel.create).toBeCalledWith(newProduct);
  });

  it("should return 201 response status code", async () => {
    await productService.createProduct(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", async () => {
    productModel.create.mockReturnValue(newProduct);
    await productService.createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct);
  });

  it("should handle error-message", async () => {
    const errorMessage = { message: "One of property is missed" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.create.mockReturnValue(rejectedPromise);
    await productService.createProduct(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("Product Get", () => {
  it("should have a getProducts function", () => {
    expect(typeof productService.getProduct).toBe("function");
  });

  it("should call Product.find({})", async () => {
    await productService.getProduct(req, res, next);
    expect(productModel.find).toHaveBeenCalledWith({});
  });

  it("should retrun 200 response", async () => {
    await productService.getProduct(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });

  it("should return json body in response", async () => {
    productModel.find.mockReturnValue(allProducts);
    await productService.getProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(allProducts);
  });

  it("should handle error-message", async () => {
    const errorMessage = { message: "Error finding product data" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.find.mockReturnValue(rejectedPromise);
    await productService.getProduct(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
