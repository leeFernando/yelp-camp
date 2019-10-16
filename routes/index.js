var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing");
});

//Register Route
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp, "+user.username);
            res.redirect("/campground");
        });
    });
});

//Login Route
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});
router.post("/login", passport.authenticate("local", {
    successFlash: "You are logged in!",
    successRedirect: "/campground",
    failureRedirect: ("/login"),
    failureFlash: "Invalid username or password"
}) , function(req, res) {});

//Logout Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("error", "Successfully Log Out!");
    res.redirect("/campground");
});

module.exports = router;