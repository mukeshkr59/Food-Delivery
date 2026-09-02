// import { raw } from "body-parser";
import foodModel from "../models/foodModel.js";
import { deleteCache, getCache, setCache } from "../config/redis.js";
import fs from "fs";

const FOOD_LIST_CACHE_KEY = "food:list";
const FOOD_LIST_CACHE_TTL = Number.parseInt(
  process.env.FOOD_CACHE_TTL || "300",
  10,
);

const addFood = async (req, res) => {
  // let image_filename = `${req.file?req.file.filename:"default.png"}`;
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    await deleteCache(FOOD_LIST_CACHE_KEY);
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const listFood = async (req, res) => {
  try {
    const cachedFoods = await getCache(FOOD_LIST_CACHE_KEY);
    if (cachedFoods) {
      return res.json({ success: true, data: JSON.parse(cachedFoods) });
    }

    const foods = await foodModel.find({}).lean();
    await setCache(
      FOOD_LIST_CACHE_KEY,
      JSON.stringify(foods),
      FOOD_LIST_CACHE_TTL,
    );
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFood = async (req, res) => {
  try {
    console.log(req.body);
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    await deleteCache(FOOD_LIST_CACHE_KEY);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
