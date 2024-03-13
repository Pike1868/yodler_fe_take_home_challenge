var express = require("express");
var router = express.Router();
var _ = require("lodash");
var logger = require("../lib/logger");
var log = logger();
var users = require("../init_data.json").data;
var curId = _.size(users);
const bcrypt = require("bcrypt");
const { createToken } = require("../helpers/tokens");

/* GET users listing. */
router.get("/", function (req, res) {
  res.json(_.toArray(users));
});

/* Create a new user */
router.post("/", async function (req, res) {
  var user = req.body;
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user = { ...user, password: hashedPassword };

  user.id = curId++;
  if (!user.state) {
    user.state = "pending";
  }
  //Add isAdmin property
  user.isAdmin = user.isAdmin || false;

  //Add user to "DB"
  users[user.id] = user;
  log.info("Created user", { id: user.id, email: user.email });
  const token = createToken({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin,
  });

  // send token back as response
  res.json({ token });
});

/**Logs user in, returns jwt*/

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = Object.values(users).find((user) => user.email === email); // Find user by email
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password with bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = createToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      // Excluding password from token payload
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

/* Get a specific user by id */
router.get("/:id", function (req, res, next) {
  var user = users[req.params.id];
  if (!user) {
    return next();
  }
  res.json(users[req.params.id]);
});

/* Delete a user by id */
router.delete("/:id", function (req, res) {
  var user = users[req.params.id];
  delete users[req.params.id];
  res.status(204);
  log.info("Deleted user", user);
  res.json(user);
});

/* Update a user by id */
router.put("/:id", function (req, res, next) {
  var user = req.body;
  if (user.id != req.params.id) {
    return next(new Error("ID paramter does not match body"));
  }
  users[user.id] = user;
  log.info("Updating user", user);
  res.json(user);
});

module.exports = router;
