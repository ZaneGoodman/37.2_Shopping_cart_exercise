process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let item = { name: "orange", price: 10.5 };

beforeEach(function () {
  items.push(item);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([item]);
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${item.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(item);
  });
  test("responds with 404 for invalid item", async () => {
    const res = await request(app).get("/items/pickle");
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app).post("/items").send({
      name: "pickle",
      price: 1.03,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "pickle", price: 1.03 } });
  });
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({ price: 5 });
    expect(res.statusCode).toBe(400);
  });

  test("Responds with 400 if price is missing", async () => {
    const res = await request(app).post("/items").send({ name: "apple" });
    expect(res.statusCode).toBe(400);
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating a items name", async () => {
    const res = await request(app)
      .patch(`/items/${item.name}`)
      .send({ name: "Milk" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: item });
  });
});
test("Responds with 404 for invalid name", async () => {
  const res = await request(app).patch(`/items/donut`).send({ name: "cheese" });
  expect(res.statusCode).toBe(404);
});

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${item.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
});
test("Responds with 404 for deleting an invalid item", async () => {
  const res = await request(app).delete(`/items/cereal`);
  expect(res.statusCode).toBe(404);
});
