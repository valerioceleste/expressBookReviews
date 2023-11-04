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
        users.push({"username":username, "password": password}); 
        return res.status(200).json({ message: "You have successfully registered. Now you can log in." });
      } else {
        return res.status(404).json({ message: "User already exists!" }); 
      }
    }
    
    return res.status(404).json({ message: "Unable to register user. Make sure you provide both username and password." });
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bookList = Object.values(books);
  return res.status(200).send(JSON.stringify({bookList}, null, 4));
});

// TASK 10 - Get the book list available in the shop using promises
public_users.get('/async-get-books',function (req, res) {

    const bookList = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      bookList.then(() => console.log("Promise for Task 10 resolved"));

  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "ISBN not found."});
  }
  
});

// TASK 11 - Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn/async-get-books',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    // console.log(isbn);
        if (req.params.isbn <= 10) {
        resolve(res.send(books[isbn]));
    }
        else {
            reject(res.send('ISBN not found'));
        }
    });
    get_books_isbn.
        then(function(){
            console.log("Promise for Task 11 is resolved");
   }).
        catch(function () { 
                console.log('ISBN not found');
  });

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

// TASK 12 - Get book details based on author using Promises
public_users.get('/author/:author/async-get-books',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
            "title":books[isbn]["title"],
            "reviews":books[isbn]["reviews"]});

          resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
          }
        });
        reject(res.send("The mentioned ISBN does not exist "))
        });
        get_books_isbn.then(function(){
                console.log("Promise for Task 12 is resolved");
       }).catch(function () { 
                    console.log('The mentioned ISBN does not exist');
      });
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

// TASK 13 - Get book details based on title using Promises
public_users.get('/title/:title/async-get-books',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
    let booksbytitle = [];
    let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
            "title":books[isbn]["title"],
            "reviews":books[isbn]["reviews"]});

          resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
          }
        });
        reject(res.send("The mentioned title does not exist "))
        });
        get_books_isbn.then(function(){
                console.log("Promise for Task 13 is resolved");
       }).catch(function () { 
                    console.log('The mentioned title does not exist');
      });
      });



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn]["reviews"]
  return res.status(200).json(reviews);
});

module.exports.general = public_users;