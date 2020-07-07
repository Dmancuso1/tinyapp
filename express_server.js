const express = require('express');
const app = express();
const PORT = 8080; // default port

app.set("view engine", "ejs");

// this represents the data we're working from.
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


// generates a ranom alpha-numberic string as the id.
function generateRandomString() {
  return Math.random().toString(36).substring(2,8);
}


// Body Parser - this has to come before all routes.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));




// routes
app.get('/', (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body</html");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase }; //ejs: can only send variables as objects
  res.render("urls_index", templateVars);
});

// gets the form to add a new url
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});




// gets the page with newly created id number
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] // <- note square notation for key we dont yet know.
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

//Add a POST request to update a resource. redirects to same page. 
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

//Add a POST route that removes a URL resource: POST /urls/:shortURL/delete, then redirs to /urls
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls");
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});



// server connect.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});