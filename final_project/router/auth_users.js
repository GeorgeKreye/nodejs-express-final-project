const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const findUserIndex = (username) => {
    for (i = 0; i < users.length; i++) {
        const user = users[i];
        if (user['username'] == username) {
            return i;
        }
    }
    return -1;
}

const isValid = (username)=>{ //returns boolean
    return findUserIndex(username) != -1;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const userIndex = findUserIndex(username);
    if (userIndex != -1) {
        const user = users[userIndex];
        return user['password'] == password;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (isValid(username) && authenticatedUser(username, password)) {
            let accessToken = jwt.sign({
                data: password
            }, 'access', {expiresIn: 60 * 60});
            req.session.authorization = {
                accessToken, username
            }
            res.status(200).json({message:"User successfully logged in"})
        } else {
            res.status(403).json({message:"Could not login: Invalid username or password"});
        }
    } else {
        res.status(400).json({message:"Could not login: Username, password, or both either missing or malformed"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization['username'];

    if (review) {
        let reviews = books[isbn]['reviews'];
        reviews[username] = review;
        books[isbn]['reviews'] = reviews;
        res.status(200).json({message:"Review added"});
    } else {
        res.status(400).json({message:"Could not add review: Review content missing or malformed"})
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
    let reviews = books[isbn]['reviews'];
    delete reviews[username];
    books[isbn]['reviews'] = reviews;
    res.status(200).json({message:"Review deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
