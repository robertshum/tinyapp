//express for endpoints
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080; // default port 8080

//TODO validation checking
//TODO add https:// or http://
//TODO lots of magic values ("userName")
//Use Embeded JS
app.set("view engine", "ejs");

//Middleware - Used so we can populate body for POST requests
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  user1RandomID: {
    id: "user1RandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const findUserByEmail = function(email) {

  //return null if email is empty
  if (typeof email === "string" && email.length === 0) {
    //empty
    return null;
  }
  //iterate over users
  //get the email of the object
  //if it matches return user object NOT users.
  for (const user in users) {
    const userParam = users[user];
    if (userParam.email === email) {
      return user;
    }
  }
  //if it gets to here, return null
  return null;
};


//TODO move somewhere else, buckaroo
//TODO refactor inside as well
const generateRandomString = function() {

  let results = '';

  //do this 6 times
  const count = 7;
  let char = '';
  for (let i = 0; i < count; i++) {
    if (Math.random() <= 0.5) {
      //pick a range from 97-122, randomly (a-z)
      const alphaNum = 97 + Math.random() * (122 - 97 + 1);

      //convert that to a character. String.fromCharCode()
      char = String.fromCharCode(alphaNum);
      results += char;
      continue;
    }

    //else, >= 0.5
    //pick a range from 65-90, randomly (a-z)
    const alphaNum = 65 + Math.random() * (90 - 65 + 1);

    //convert that to a character. String.fromCharCode()
    char = String.fromCharCode(alphaNum);
    results += char;
  }

  return results;
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {

  //get user id
  const userId = req.cookies["user_id"];

  const templateVars = {
    urls: urlDatabase,
    userName: users[userId]
  };
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {

  //get user id
  const userId = req.cookies["user_id"];

  const templateVars = {
    userName: users[userId]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {

  //get user id
  const userId = req.cookies["user_id"];


  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    userName: users[userId]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const key = req.params.id;
  const longURL = urlDatabase[key];
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//GET - Register
app.get("/register", (req, res) => {

  res.render("register");
});

//POST - Login
app.post("/login", (req, res) => {
  const userName = req.body.username;

  //set Cookies.
  res.cookie("userName", userName);

  //redirect
  res.redirect("/urls");
});

//POST - Register
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString() + generateRandomString();

  //email or pw are empty strings, return 404
  if ((email === undefined || email === "") || (password === undefined || password === "")) {
    res.statusCode = 400;
    res.send("Your password or email is empty!");
    return;
  }

  if(findUserByEmail(email)) {
    res.statusCode = 400;
    res.send("This email is taken, buckaroo.");
    return;
  }

  //validate the email doesn't exist

  //insert, via ES6 shorthand
  users[id] = {
    id,
    email,
    password
  };

  console.log(users);

  //set Cookies.
  res.cookie("user_id", id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  const userName = req.cookies["userName"];

  if (userName !== undefined) {

    //clear cookies
    res.clearCookie("userName");
  }

  //redirect
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const randomKey = generateRandomString();
  const url = req.body.longURL;
  urlDatabase[randomKey] = url;
  res.redirect(`/urls/${randomKey}`);
});

//validation checking???
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newURL = req.body.newURL;
  urlDatabase[id] = newURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  //TODO validation checking
  const idToRemove = req.params.id;
  delete urlDatabase[idToRemove];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// The syntax for includes has changed in the latest version of EJS. We'll be using: <%- include('partials/_header') %> instead of what is recommended in the tutorial.