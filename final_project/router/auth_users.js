const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let users = [];   // this will store registered users
const secretKey = "fingerprint_customer";  // used for JWT signing

// Utility: check if username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Utility: check if username + password match
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// ---- Task 6: Register endpoint ----
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login." });
});

// ---- Task 7: Login endpoint ----
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Login successful!", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// ---- Task 8: Add or modify a book review ----
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // review text will come as query param
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  // Check if book exists
  let book = require("./booksdb.js")[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review
  book.reviews[username] = review;

  return res.status(200).json({ 
    message: "Review added/updated successfully", 
    reviews: book.reviews 
  });


});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  // Load books database
  let books = require("./booksdb.js");

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted", reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "You haven’t posted a review for this book" });
  }
});






module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
