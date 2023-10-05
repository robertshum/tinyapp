//express for endpoints
const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const constants = require("./constants");

const {
  urlsForUser,
  findUserByEmail,
  getUserLoggedIn,
  generateRandomString
} = require("./helpers");

const app = express();
const PORT = constants.PORT; // default port 8080

//Use Embeded JS (Set key view engine to ejs)
app.set("view engine", "ejs");

//Middleware - Used so we can populate body for POST requests
//if there is a url encoded body, it converts it
app.use(express.urlencoded({ extended: false }));

//app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"], // Replace with your keys
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (e.g., 24 hours)
  })
);

//logger
app.use(morgan('dev'));

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

//ROOT
app.get("/", (req, res) => {
  res.send("Hello!");
});

//GET - URLS
app.get("/urls", (req, res) => {

  //check if user is logged in
  if (getUserLoggedIn(req) === undefined) {
    res.redirect("/login");
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
    res.send(constants.MSG_LOGIN_TO_VIEW_URL);
    return;
  }

  //check if the URL belongs to them
  const urlId = req.params.id;
  const matchingUrls = urlsForUser(urlDatabase, userId);
  if (matchingUrls[urlId] === undefined) {
    res.send(constants.MSG_AUTHOR_VIEW_ONLY);
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
    res.send(constants.MSG_URL_KEY_INVALID);
  }

  res.redirect(longURL);
});

//GET - JSON of url DB
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
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

  if (getUserLoggedIn(req)) {
    res.redirect("/urls");
  }

  const email = req.body.email;
  const userPassword = req.body.password;

  //check if user is valid
  const user = findUserByEmail(users, email);

  if (user === undefined) {
    //can't find user
    res.status(403).send(constants.MSG_CANNOT_FIND_USER_CRED);
    return;
  }

  //HASH BROWNS
  const passwordMatch = bcrypt.compareSync(userPassword, user.password);

  //check if password matches
  if (!passwordMatch) {
    //same error as above for security reasons
    res.status(403).send(constants.MSG_CANNOT_FIND_USER_CRED);
    return;
  }

  //user.id at this point, so we set it to session cookies
  req.session.userId = user.id;

  //redirect
  res.redirect("/urls");
});

//POST - Register
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //double the # of id's, double the fun.
  const id = generateRandomString() + generateRandomString();

  //email or pw are empty strings, return 400
  if ((email === undefined || email === "") || (password === undefined || password === "")) {
    res.status(400).send(constants.MSG_EMPTY_EMAIL_PW);
    return;
  }

  if (findUserByEmail(users, email)) {
    res.status(400).send(constants.MSG_EMAIL_TAKEN);
    return;
  }

  //HASH BROWNS BABY
  const hashedPassword = bcrypt.hashSync(password, 10);

  //insert, via ES6 shorthand
  users[id] = {
    id,
    email,
    password: hashedPassword
  };

  //set session cookies
  req.session.userId = id;
  res.redirect("/urls");
});

//POST - Log User Out
app.post("/logout", (req, res) => {
  const user = getUserLoggedIn(req);

  if (user !== undefined) {

    //remove userId from session
    delete req.session.userId;
  }

  //redirect
  res.redirect("/login");
});

//POST - Create New URL / Key
app.post("/urls", (req, res) => {

  //check if user is logged in
  const userId = getUserLoggedIn(req);
  if (userId === undefined) {
    res.send(constants.MSG_CANNOT_SHORT_URL_WITHOUT_ACCT);
    return;
  }

  const randomKey = generateRandomString();
  const url = req.body.longURL;

  //TODO duplicate in post edit
  if (!url.includes("http://") && !url.includes("https://")) {
    res.send(constants.MSG_MISSING_HTTP);
    return;
  }

  urlDatabase[randomKey] = {
    longURL: url,
    userId
  };

  res.redirect(`/urls/${randomKey}`);
});

app.post("/urls/:id", (req, res) => {

  //check if user is logged in
  const userId = getUserLoggedIn(req);
  if (userId === undefined) {
    res.send(constants.MSG_LOGIN_TO_EDIT_URL);
    return;
  }

  //check if the URL belongs to them
  const urlId = req.params.id;
  const matchingUrls = urlsForUser(urlDatabase, userId);
  if (matchingUrls[urlId] === undefined) {
    res.send(constants.MSG_AUTHOR_TO_EDIT_URL);
    return;
  }

  //CASE - POST /urls/:id should return a relevant error message if id does not exist
  //we will never get this because it would be caught in the first two checks above.

  const newURL = req.body.newURL;

  if (!newURL.includes("http://") && !newURL.includes("https://")) {
    res.send(constants.MSG_MISSING_HTTP);
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
    res.send(constants.MSG_LOGIN_TO_DELETE_URL);
    return;
  }

  //check if the URL belongs to them
  const urlId = req.params.id;
  const matchingUrls = urlsForUser(urlDatabase, userId);
  if (matchingUrls[urlId] === undefined) {
    res.send(constants.MSG_AUTHOR_TO_DELETE_URL);
    return;
  }

  //CASE - POST /urls/:id/delete should return a relevant error message if id does not exist
  //we will never get this because it would be caught in the first two checks above.

  const idToRemove = req.params.id;
  delete urlDatabase[idToRemove];
  res.redirect("/urls");
});

app.listen(PORT);