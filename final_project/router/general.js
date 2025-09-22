const express = require('express');
const axios = require('axios');   // 🔑 Needed for async calls
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// ==================== TASK 10 ====================
// Get book list using async/await + Axios
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// ==================== TASK 11 ====================
// Get book by ISBN using async/await
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found", error: error.message });
  }
});

// ==================== TASK 12 ====================
// Get books by Author using async/await
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const { author } = req.params;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author", error: error.message });
  }
});

// ==================== TASK 13 ====================
// Get books by Title using async/await
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found with this title", error: error.message });
  }
});

module.exports.general = public_users;
