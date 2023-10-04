//express for endpoints
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080; // default port 8080

//TODO validation checking
//TODO add https:// or http://
//TODO lots of magic values ("1_id")
//Use Embeded JS
app.set("view engine", "ejs");

//Middleware - Used so we can populate body for POST requests
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userId: "user1RandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userId: "user2RandomID"
  }
};

const users = {
  user1RandomID: {
    id: "user1RandomID",
    email: "user@example.com",
    password: "1234",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "1234",
  },
};

const urlsForUser = function(urlDatabase, userId) {
  const result = {};

  for (const urlKey in urlDatabase) {
    const urlObject = urlDatabase[urlKey];
    if (urlObject.userId === userId) {
      //add it to the result
      result[urlKey] = urlObject;
    }
  }

  return result;
};

const findUserByEmail = function(users, email) {

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
      return userParam;
    }
  }
  //if it gets to here, return null
  return null;
};

const getUserLoggedIn = function(req) {
  return req.cookies["user_id"];
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


//ROOT
app.get("/", (req, res) => {
  res.send("Hello!");
});

//GET - URLS
app.get("/urls", (req, res) => {

  //check if user is logged in
  if (getUserLoggedIn(req) === undefined) {
    res.send("<html><body>Please login or create an account to view and create URLs.</body></html>\n");
    return;
  }

  //get user id
  const userId = getUserLoggedIn(req);

  //just get the ones for the user
  const filteredUrlDatabase = urlsForUser(urlDatabase, userId);

  const templateVars = {
    urls: filteredUrlDatabase,
    user: users[userId]
  };
  res.render("urls_index", templateVars);
});

//GET - Login Page
app.get("/login", (req, res) => {

  //check if user is logged in
  if (getUserLoggedIn(req)) {
    res.redirect("/urls");
    return;
  }

  const templateVars = {
    user: undefined
  };

  res.render("login", templateVars);
});

//GET - New URL Page
app.get("/urls/new", (req, res) => {

  //get user id
  const userId = getUserLoggedIn(req);

  //check if user is logged in
  if (userId === undefined) {
    res.redirect("/login");
    return;
  }

  const templateVars = {
    user: users[userId]
  };
  res.render("urls_new", templateVars);
});

//GET - View Specific URL
app.get("/urls/:id", (req, res) => {

  //check if user is logged in
  const userId = getUserLoggedIn(req);
  if (userId === undefined) {
    res.send("<html><body>You cannot view URLs unless you are logged in.</body></html>\n");
    return;
  }

  //check if the URL belongs to them
  const urlId = req.params.id;
  const matchingUrls = urlsForUser(urlDatabase, userId);
  if (matchingUrls[urlId] === undefined) {
    res.send("<html><body>You cannot view the URL unless you were the author.</body></html>\n");
    return;
  }

  const templateVars = {
    id: urlId,
    longURL: urlDatabase[urlId].longURL,
    user: users[userId]
  };
  res.render("urls_show", templateVars);
});

//GET - Redirect to long URL
app.get("/u/:id", (req, res) => {
  const key = req.params.id;
  const longURL = urlDatabase[key].longURL;

  //the url id does not exist
  if (longURL === undefined) {
    res.setHeader("Content-Type", "text/html");
    res.send("<html><body>The URL key does not exist.</body></html>\n");
  }

  res.redirect(longURL);
});

//GET - JSON of url DB
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//GET - Test HTML Hello
app.get("/hello", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//GET - Register
app.get("/register", (req, res) => {

  //check if user is logged in
  if (getUserLoggedIn(req)) {
    res.redirect("/urls");
    return;
  }

  const templateVars = {
    user: undefined
  };
  res.render("register", templateVars);
});

//POST - Login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const userPassword = req.body.password;

  //check if user is valid
  const user = findUserByEmail(users, email);

  if (user === null) {
    //can't find user
    res.statusCode = 403;
    res.send("cannot find user with this email and password");
    return;
  }

  //check if password matches
  if (user.password !== userPassword) {
    res.statusCode = 403;
    res.send("cannot find user with this email and password");
    return;
  }

  //user email and password matches
  //set Cookies.
  res.cookie("user_id", user.id);

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

  if (findUserByEmail(users, email)) {
    res.statusCode = 400;
    res.send("This email is taken, buckaroo.");
    return;
  }

  //insert, via ES6 shorthand
  users[id] = {
    id,
    email,
    password
  };

  //set Cookies.
  res.cookie("user_id", id);
  res.redirect("/urls");
});

//POST - Log User Out
app.post("/logout", (req, res) => {
  const user = req.cookies["user_id"];

  if (user !== undefined) {

    //clear cookies
    res.clearCookie("user_id");
  }

  //redirect
  res.redirect("/login");
});

//POST - Create New URL / Key
app.post("/urls", (req, res) => {

  //check if user is logged in
  const userId = getUserLoggedIn(req);
  if (userId === undefined) {
    res.send("<html><body>You cannot shorten URLs unless you have an account.</body></html>\n");
    return;
  }

  const randomKey = generateRandomString();
  const url = req.body.longURL;

  //TODO duplicate in post edit
  if (!url.includes("http://") && !url.includes("https://")) {
    res.send("<html><body>Please attach http:// or https://</body></html>\n");
    return;
  }

  urlDatabase[randomKey] = {
    longURL: url,
    userId
  };

  console.log("after add db:", urlDatabase);

  res.redirect(`/urls/${randomKey}`);
});

app.post("/urls/:id", (req, res) => {

  //check if user is logged in
  const userId = getUserLoggedIn(req);
  if (userId === undefined) {
    res.send("<html><body>You cannot edit links unless you are logged in.</body></html>\n");
    return;
  }

  //check if the URL belongs to them
  const urlId = req.params.id;
  const matchingUrls = urlsForUser(urlDatabase, userId);
  if (matchingUrls[urlId] === undefined) {
    res.send("<html><body>You cannot edit the URL unless you were the author.</body></html>\n");
    return;
  }

  //CASE - POST /urls/:id should return a relevant error message if id does not exist
  //we will never get this because it would be caught in the first two checks above.

  const newURL = req.body.newURL;

  if (!newURL.includes("http://") && !newURL.includes("https://")) {
    res.send("<html><body>Please attach http:// or https://</body></html>\n");
    return;
  }

  urlDatabase[urlId].longURL = newURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {

  //TODO duplicated code as /urls/:id POST
  //check if user is logged in
  const userId = getUserLoggedIn(req);
  if (userId === undefined) {
    res.send("<html><body>You cannot delete links unless you are logged in.</body></html>\n");
    return;
  }

  //check if the URL belongs to them
  const urlId = req.params.id;
  const matchingUrls = urlsForUser(urlDatabase, userId);
  if (matchingUrls[urlId] === undefined) {
    res.send("<html><body>You cannot delete the URL unless you were the author.</body></html>\n");
    return;
  }

  //CASE - POST /urls/:id/delete should return a relevant error message if id does not exist
  //we will never get this because it would be caught in the first two checks above.

  const idToRemove = req.params.id;
  delete urlDatabase[idToRemove];
  console.log("after delete db:", urlDatabase);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// The syntax for includes has changed in the latest version of EJS. We'll be using: <%- include('partials/_header') %> instead of what is recommended in the tutorial.