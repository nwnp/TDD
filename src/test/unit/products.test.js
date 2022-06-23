const productService = require("../../services/api.service");
const productModel = require("../../models/Product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");
const allProducts = require("../data/all-products.json");

productModel.create = jest.fn(); // create mock function
productModel.find = jest.fn();
productModel.findById = jest.fn();

const productId = "62b40f144699bae9886e8d5d";

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

describe("Product GetById", () => {
  it("should have a getProductById", () => {
    expect(typeof productService.getProduct).toBe("function");
  });

  it("should call Product.findById({})", async () => {
    req.params.productId = productId;
    await productService.getProductById(req, res, next);
    expect(productModel.findById).toHaveBeenCalledWith(productId);
  });

  it("should return json body and status code", async () => {
    productModel.findById.mockReturnValue(newProduct);
    await productService.getProductById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return 404 when item doesnt exist", async () => {
    productModel.findById.mockReturnValue(null);
    await productService.getProductById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled).toBeTruthy();
  });

  it("should handle error", async () => {
    const errorMessage = { message: "error" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.findById.mockReturnValue(rejectedPromise);
    await productService.getProductById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
