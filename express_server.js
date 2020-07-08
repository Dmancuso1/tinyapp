const express = require('express');
const app = express();
const PORT = 8080; // default port

app.set("view engine", "ejs");

// Parsers - this has to come before all routes.
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));




// DATABASE >>>------------------------>

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}




// Helper functions >>>------------------------>

// generates 6-char random alpha-num string as id.
function generateRandomString() {
  return Math.random().toString(36).substring(2,8);
}

//email lookup function
function checkEmailDupe(emailInput) {
  for (user in users) {
    if (emailInput === users[user].email) {
      return true;
    }
  }
  return false;
};

// check password
function checkPassword(passwordInput) {
  for (user in users) {
    if (passwordInput === users[user].password) {
      // return true;
      return { password: users[user].password, email: users[user].email, id: users[user].id }
    }
  }
  return false;
};




// routes >>>------------------------>

app.get('/', (req, res) => {
  res.send("Hello!");
});

app.get('/q=users', (req, res) => {
  res.json(users);

});

// sets an appropriate user_id cookie on successful login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!checkEmailDupe(email)) {
    res.status(400).send('Error: No user found');
  } else if (!checkPassword(password)) {
    res.status(403).send('Error: invalid password');
  } else {
    const newUserData = checkPassword(password)
    res.cookie('user_id', newUserData.id )
    res.redirect("/urls/")
  }
});

  // fetch login_user
app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render("login_user", templateVars);
});


//remove cookie from username
app.post("/logout",(req, res) => {
  // res.clearCookie('username', req.body.username)
  res.clearCookie('user_id', req.body.id )
  res.redirect("/urls/")
});

app.get('/register', (req,res) => {
  let templateVars = { user: users[req.cookies["user_id"]] }
  res.render("register_user", templateVars)
});

// add new user object to users and set cookie user_id.
app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  // 404 res if input fields empty
  if (email === "" || password === "") {
    res.status(400).send('Error: empty user input fields')
  } else if (checkEmailDupe(email)) {
    res.status(400).send('Error: Email already exists')
  } else {
  const newUser = {
    id,
    email,
    password
  }
  users[id] = newUser;

  res.cookie('user_id', id);
  res.redirect("/urls/")
 }
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] }; //ejs: can only send variables as objects
  res.render("urls_index", templateVars);
});

// gets the form to add a new url
app.get("/urls/new", (req, res) => {
  if (users[req.cookies["user_id"]]) {
    res.render("urls_new", { user: users[req.cookies["user_id"]] });
  } else {
    res.redirect("/urls");
  }
});

// gets the page with newly created id number
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL], 
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
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