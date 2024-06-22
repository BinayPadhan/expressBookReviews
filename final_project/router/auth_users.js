const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// User login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ username }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = { accessToken, username };
        return res.status(200).send(`User successfully logged in ${accessToken}`);
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        const { reviewer, rating, comment } = req.body;

        if (!reviewer || !rating || !comment) {
            return res.status(400).send("Review data is incomplete");
        }

        const reviewId = Object.keys(book.reviews).length + 1;
        book.reviews[reviewId] = { reviewer, rating, comment };

        return res.status(200).send(`Review added to the book with ISBN ${isbn}.`);
    } else {
        return res.status(404).send("Book not found");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!isbn || !username) {
        return res.status(400).send("Invalid ISBN or user not logged in");
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).send(`Book with the ISBN ${isbn} not found.`);
    }

    let reviewDeleted = false;
    for (let reviewId in book.reviews) {
        if (book.reviews[reviewId].reviewer === username) {
            delete book.reviews[reviewId];
            reviewDeleted = true;
        }
    }

    if (reviewDeleted) {
        return res.status(200).send(`Reviews by ${username} for the book with ISBN ${isbn} have been deleted.`);
    } else {
        return res.status(404).send(`No reviews found by ${username} for the book with ISBN ${isbn}.`);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
