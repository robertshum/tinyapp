const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//TODO validation checking
//TODO add https:// or http://
//Use Embeded JS
app.set("view engine", "ejs");

//Used so we can populate body for POST requests
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//TODO move somewhere else, buckaroo
//TODO refactor inside as well
function generateRandomString() {

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
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
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