const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// public_users.post("/register", (req,res) => {
    
// });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author;
    let bookDetails = null;

    for (let bookId in books) {
        if (books[bookId].author === authorName) {
            bookDetails = books[bookId];
            res.json(bookDetails);
            break;
        }
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let bookDetails = null;

    for (let bookId in books) {
        if (books[bookId].title === title) {
            bookDetails = books[bookId];
            res.json(bookDetails);
            break;
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let bookDetails = null;

    for (let bookId in books) {
        if (bookId === isbn) {
            bookDetails = books[bookId].reviews;
            res.json(bookDetails);
            break;
        }
    }
});

module.exports.general = public_users;
