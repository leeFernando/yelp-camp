var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkPostOwner = function(req, res, next) {
    //check if a user is logged in
    if(req.isAuthenticated()) {
        //find the selected campground
        Campground.findById(req.params.id, function(err, campground) {
            if(err || !campground) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                //check if campground's author = current user
                if(campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwner = function(req, res, next) {
    //check if a user is logged in
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, campground) {
            if(err || !campground) {
                req.flash("error", "Campground not found");
                return res.redirect("back");
            }
            Comment.findById(req.params.comment_id, function(err, comment) {
                if(err || !comment) {
                    req.flash("error", "Comment not found!");
                    res.redirect("back");
                } else {
                    //check if campground's author = current user
                    if(comment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back")
    }
}

module.exports = middlewareObj;