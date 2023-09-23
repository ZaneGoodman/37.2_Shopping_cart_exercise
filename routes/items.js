const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", (req, res, next) => {
  try {
    if (!items) {
      throw new ExpressError("Nothing in the Shopping Cart", 400);
    }
    return res.json(items);
  } catch (e) {
    return next(e);
  }
});

router.post("/", (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price) {
      throw new ExpressError("Missing reqiured information", 400);
    }
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (e) {
    next(e);
  }
});

router.get("/:name", (req, res, next) => {
  try {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404);
    }
    res.json(foundItem);
  } catch (e) {
    next(e);
  }
});

router.patch("/:name", (req, res, next) => {
  try {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404);
    }
    foundItem.name = req.body.name;
    res.json({ updated: foundItem });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:name", (req, res, next) => {
  const foundItem = items.findIndex((item) => item.name === req.params.name);
  if (foundItem === -1) {
    throw new ExpressError("item not found", 404);
  }
  items.splice(foundItem, 1);
  res.json({ message: "Deleted" });
});

module.exports = router;
