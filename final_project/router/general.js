const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    return users.some(user => user.username === username);
};

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const authorName = req.params.author;
    const bookDetails = Object.values(books).filter(book => book.author === authorName);

    if (bookDetails.length > 0) {
        res.json(bookDetails);
    } else {
        res.status(404).json({ message: "Books by this author not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const bookDetails = Object.values(books).filter(book => book.title === title);

    if (bookDetails.length > 0) {
        res.json(bookDetails);
    } else {
        res.status(404).json({ message: "Books with this title not found" });
    }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
