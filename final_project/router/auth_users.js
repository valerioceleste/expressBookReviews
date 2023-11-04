const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
    let userWithSameName = users.filter((user) => {
      return user.username === username
    });
  
    if (userWithSameName.length > 0) {
      return true;
    } else {
      return false;
    }
  }

const authenticatedUser = (username, password) => { 
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (authenticatedUser(username, password)) {
      const accessToken = jwt.sign({ data: password }, "access", { expiresIn: 60 * 60 });
      req.session.authorization = { accessToken, username };
      return res.status(200).json({ message: "User successfully logged in" });
    } else {
      return res.status(401).json({ message: "Invalid login: Check username and password" });
    }
  });
  
  
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    let filtered_book = books[isbn]
    if (filtered_book) {
        let review = req.query.review;
        let reviewer = req.session.authorization['username'];
        if(review) {
            filtered_book['reviews'][reviewer] = review;
            books[isbn] = filtered_book;
        }
        res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
    }
    else{
        res.send("Unable to find this ISBN!");
    }
  });

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let reviewer = req.session.authorization['username'];
    let filtered_review = books[isbn]["reviews"];
    if (filtered_review[reviewer]){
        delete filtered_review[reviewer];
        res.send(`Reviews for the ISBN  ${isbn} posted by the user ${reviewer} deleted.`);
    }
    else{
        res.send("Can't delete, as this review has been posted by a different user");
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;