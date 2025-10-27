const queries = require("../queries/itemQueries.js");

const getAllItems = async (req, res) => {
  try {
    const items = await queries.findAllItems(req.query.shop_id);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await queries.findItemById(id);
    if (!item) return res.status(404).json({ msg: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const { GoogleGenAI } = require("@google/genai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const fetch = require("node-fetch");
const GOOGLE_SEARCH_KEY = process.env.GOOGLE_SEARCH_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

async function fetchImage(query) {
  try {
    const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query
    )}&cx=${GOOGLE_SEARCH_ENGINE_ID}&searchType=image&key=${GOOGLE_SEARCH_KEY}&num=1`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    } else {
      throw new Error("No image found for the query.");
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

const createItem = async (req, res) => {
  try {
    const { name, shop_id, quantity } = req.body;
    let geminiData = {};
    let image_url = null;
    if (name && GEMINI_API_KEY) {
      const prompt = `Give a JSON object with details for a food item named '${name}'. The Standardized name of the food item, Description being a short list of its nutritional information and other factual details, an array of tags which might apply to the food item Example: {"name":..., "description":..., "tags":...}`;
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        let text = response.text;
        if (text) {
          // Remove markdown code block markers if present
          text = text.trim();
          if (text.startsWith("```json")) {
            text = text
              .replace(/^```json/, "")
              .replace(/```$/, "")
              .trim();
          } else if (text.startsWith("```")) {
            text = text.replace(/^```/, "").replace(/```$/, "").trim();
          }
          try {
            geminiData = JSON.parse(text);
          } catch (e) {
            console.error("Error parsing Gemini response:", e.message);
            geminiData = {};
          }
        }
      } catch (gerr) {
        console.error("Gemini API error:", gerr.message);
        geminiData = {};
      }
      // Fetch image for the item name
    }
    const itemData = { ...req.body, ...geminiData };
    image_url = await fetchImage(itemData.name);
    if (image_url) itemData.image_url = image_url;
    console.log("geminiData:", geminiData);

    // Check if item with same name and shop_id exists
    const existing = await queries.findItemByNameAndShopId(
      itemData.name,
      itemData.shop_id
    );
    if (existing) {
      // Add quantity to existing item
      const newQuantity =
        (parseInt(existing.quantity, 10) || 0) +
        (parseInt(itemData.quantity, 10) || 0);
      const updatedItem = await queries.updateItemById(existing.id, {
        quantity: newQuantity,
      });
      res
        .status(200)
        .json({ ...existing, quantity: newQuantity, updated: true });
    } else {
      const newItem = await queries.createItem(itemData);
      res.status(201).json(newItem);
    }
  } catch (err) {
    console.log("Error in createItem:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await queries.updateItemById(id, req.body);
    if (!updated) return res.status(404).json({ msg: "Item not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await queries.deleteItemById(id);
    if (!deleted) return res.status(404).json({ msg: "Item not found" });
    res.status(200).json({ msg: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItemById,
  deleteItemById,
};
