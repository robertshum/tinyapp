const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//Use Embeded JS
app.set("view engine", "ejs");

//Used so we can populate body for POST requests
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//TODO move somewhere else buckaroo later
function generateRandomString() {
  //do this 6 times
    //flip a coin (for upper or lower)
      //heads - lower case
        //pick a range from 77-122, randomly
        //convert that to a character. String.fromCharCode()
        //push that to an array.
      //tails - upper case
        //pick a range randomly from 65-90, randomly
        //do same thing as above
  //return array
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

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// The syntax for includes has changed in the latest version of EJS. We'll be using: <%- include('partials/_header') %> instead of what is recommended in the tutorial.