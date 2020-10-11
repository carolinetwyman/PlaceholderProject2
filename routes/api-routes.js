// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // // Route for inputting data to the goals table
  // app.post("/api/members", (req, res) => {
  //   db.Goal.create({
  //     email: req.body.email,
  //     password: req.body.password
  //   })
  //     .then(() => {
  //       res.redirect(307, "/api/login");
  //     })
  //     .catch(err => {
  //       res.status(401).json(err);
  //     });
  // });

  app.post("/api/goalsub", (req, res) => {
    console.log("test api-",req.body)
    db.Goals.create(req.body)
      .then((data) => {
        console.log("members", data)
      })
      .catch(err => {
        console.log(err.message)
      });
  });

  app.post("/api/sub", (req, res) => {
    console.log(req.body.sleep_time)
    db.DailyLog.create(req.body)
      .then((data) => {
        console.log("test",data)
        // res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

    // // GET route for getting all of the goals
  // app.get("/api/goals/", function(req, res) {
  //   db.Goals.findAll({})
  //     .then(function(dbGoals) {
  //       res.json(dbGoals);
  //     });
  // });

app.get("/api/goals", function(req, res) {
  var query = {};
  if (req.query.user_id) {
    query.UserId = req.query.user_id;
  }
  // Here we add an "include" property to our options in our findAll query
  // We set the value to an array of the models we want to include in a left outer join
  // In this case, just db.User
  db.Goals.findAll({
    where: query,
    include: [db.User]
  }).then(function(dbGoals) {
    res.json(dbGoals);
  });
});

// // GET route for getting all of the daily-logs
// app.get("/api/dailylog", function(req, res) {
//   db.DailyLog.findAll({})
//     .then(function(dbDailyLog) {
//       res.json(dbDailyLog);
//     });
// });

app.get("/api/dailylog", function(req, res) {
  var query = {};
  if (req.query.user_id) {
    query.UserId = req.query.user_id;
  }
  // Here we add an "include" property to our options in our findAll query
  // We set the value to an array of the models we want to include in a left outer join
  // In this case, just db.User
  db.DailyLog.findAll({
    where: query,
    include: [db.User]
  }).then(function(dbDailyLog) {
    res.json(dbDailyLog);
  });
});

};
