const productService = require("../../services/api.service");
const productModel = require("../../models/Product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");

productModel.create = jest.fn(); // create mock function

let req = httpMocks.createRequest();
let res = httpMocks.createResponse();
let next = null;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
});

describe("Product Controller Create", () => {
  beforeEach(() => {
    req.body = newProduct;
  });

  it("should have ad createProduct funciton", () => {
    expect(typeof productService.createProduct).toBe("function");
  });

  it("should call ProductModel.create", () => {
    productService.createProduct(req, res, next);
    expect(productModel.create).toBeCalledWith(newProduct);
  });

  it("should return 201 response status code", () => {
    productService.createProduct(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", () => {
    productModel.create.mockReturnValue(newProduct);
    productService.createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct);
  });
});
