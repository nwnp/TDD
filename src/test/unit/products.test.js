const productService = require("../../services/api.service");
const productModel = require("../../models/Product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");
const allProducts = require("../data/all-products.json");

productModel.create = jest.fn(); // create mock function
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();
productModel.update = jest.fn();

const productId = "62b40f144699bae9886e8d5d";
const updatedProduct = {
  name: "updated name",
  description: "updated description",
};

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

describe("Product Update", () => {
  it("should have an updateProduct function", async () => {
    expect(typeof productService.updateProduct).toBe("function");
  });

  it("should call productService.updateProduct()", async () => {
    req.params.productId = productId;
    req.body = {
      name: "updated name",
      description: "updated description",
    };
    await productService.updateProduct(req, res, next);
    expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.productId,
      req.body,
      { new: true }
    );
  });

  it("should return json body and response code 200", async () => {
    req.params.productId = productId;
    req.body = updatedProduct;
    productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
    await productService.updateProduct(req, res, next);
    expect(res._isEndCalled).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(updatedProduct);
  });

  it("should handle error", async () => {
    const errorMessage = { message: "error" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await productService.updateProduct(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Delete", () => {
  it("should have a deleteProduct function", () => {
    expect(typeof productService.deleteProduct).toBe("function");
  });

  it("should call productService.findByIdAndDelete()", async () => {
    req.params.productId = productId;
    await productService.deleteProduct(req, res, next);
    expect(productModel.findByIdAndDelete).toBeCalledWith(productId);
  });

  it("should return 200 response", async () => {
    let deleteProduct = {
      name: "deletedProduct",
      description: "it is deleted",
    };
    productModel.findByIdAndDelete.mockReturnValue(deleteProduct);
    await productService.deleteProduct(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(deleteProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle 404 when item doesnt exist", async () => {
    productModel.findByIdAndDelete.mockReturnValue(null);
    await productService.deleteProduct(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle error", async () => {
    const errorMessage = { message: "Delete error" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await productService.deleteProduct(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
