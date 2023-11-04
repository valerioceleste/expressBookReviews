const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({ username, password }); // Use the correct property name "username" instead of "usrname".
        return res.status(200).json({ message: "You have successfully registered. Now you can log in." });
      } else {
        return res.status(409).json({ message: "User already exists!" }); // Changed status code to 409 (Conflict) as the user already exists.
      }
    }
    
    return res.status(400).json({ message: "Unable to register user. Make sure you provide both username and password." });
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bookList = Object.values(books);
  return res.status(200).send(JSON.stringify({bookList}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found."});
  }
  
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let booksbyauthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
          booksbyauthor.push({"isbn":isbn,
                              "title":books[isbn]["title"],
                              "reviews":books[isbn]["reviews"]});
      }
  });

  return res.status(200).send(JSON.stringify({booksbyauthor}, null, 4))
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let booksbytitle = []; // Use consistent variable names
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
        if (books[isbn]["title"] === req.params.title) {
            booksbytitle.push({
                "isbn": isbn,
                "title": books[isbn]["title"],
                "reviews": books[isbn]["reviews"]
            });
        }
    });
    return res.status(200).send(JSON.stringify({ booksbytitle }, null, 4));
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;