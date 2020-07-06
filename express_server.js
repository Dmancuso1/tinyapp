const express = require('express');
const app = express();
const PORT = 8080; // default port

app.set("view engine", "ejs");

// this represents the data we're working from.
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body</html")
});


app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase } //ejs: can only send variables as objects
  res.render("urls_index", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});