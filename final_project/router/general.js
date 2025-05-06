const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
        users.push({"username":username,"password":password});
        res.status(200).json({"message":"User successfully registered; credentials can now be used for login"});
    } else {
        res.status(409).json({"message":"Could not register user: Username is already in use"});
    }
  } else {
    res.status(400).json({"message":"Could not register user: Username, password, or both were either not provided or malformed"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let authorBooks = {};
  keys = Object.keys(books);
  for (key in keys) {
    const book = books[key];
    if (book && book['author'] == author) {
        authorBooks[key] = book;
    }
  }
  res.send(JSON.stringify(authorBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let titleBooks = {};
  keys = Object.keys(books);
  for (key in keys) {
    const book = books[key];
    if (book && book['title'] == title) {
        titleBooks[key] = book;
    }
  }
  res.send(JSON.stringify(titleBooks,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn]['reviews']));
});

module.exports.general = public_users;
