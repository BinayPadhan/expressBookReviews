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

// Function to get books data
const getBooksData = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// Using Promise callbacks to get the list of books
public_users.get('/promise', (req, res) => {
    getBooksData()
        .then((books) => {
            res.json(books);
        })
        .catch((error) => {
            res.status(500).send("Error fetching books: " + error);
        });
});

// Using async-await to get the list of books
public_users.get('/async', async (req, res) => {
    try {
        const books = await getBooksData();
        res.json(books);
    } catch (error) {
        res.status(500).send("Error fetching books: " + error);
    }
});

// Function to get book details by ISBN
const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    });
}

// Using Promise callbacks to get book details by ISBN
public_users.get('/promise/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    getBookByISBN(isbn)
        .then((book) => {
            res.json(book);
        })
        .catch((error) => {
            res.status(404).send("Error fetching book: " + error);
        });
});

// Using async-await to get book details by ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await getBookByISBN(isbn);
        res.json(book);
    } catch (error) {
        res.status(404).send("Error fetching book: " + error);
    }
});

// Function to get book details by author
const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        const booksByAuthor = [];
        for (let bookId in books) {
            if (books[bookId].author === author) {
                booksByAuthor.push(books[bookId]);
            }
        }
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject("Books by this author not found");
        }
    });
}

// Using Promise callbacks to get book details by author
public_users.get('/promise/author/:author', (req, res) => {
    const author = req.params.author;
    getBooksByAuthor(author)
        .then((books) => {
            res.json(books);
        })
        .catch((error) => {
            res.status(404).send("Error fetching books: " + error);
        });
});

// Using async-await to get book details by author
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const books = await getBooksByAuthor(author);
        res.json(books);
    } catch (error) {
        res.status(404).send("Error fetching books: " + error);
    }
});

// Function to get book details by title
const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        const booksByTitle = [];
        for (let bookId in books) {
            if (books[bookId].title === title) {
                booksByTitle.push(books[bookId]);
            }
        }
        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject("Books by this title is not found");
        }
    });
}

// Using Promise callbacks to get book details by author
public_users.get('/promise/title/:title', (req, res) => {
    const title = req.params.title;
    getBooksByTitle(title)
        .then((books) => {
            res.json(books);
        })
        .catch((error) => {
            res.status(404).send("Error fetching books: " + error);title
        });
});

// Using async-await to get book details by author
public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const books = await getBooksByTitle(title);
        res.json(books);
    } catch (error) {
        res.status(404).send("Error fetching books: " + error);
    }
});

module.exports.general = public_users;
