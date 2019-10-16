var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//Comment New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //look for campground with given id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            //redirect to campground show page
            res.redirect('/campground/'+campground._id);
        } else {
            //render new.ejs including the found campground
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comment Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    //look for the campground with give id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            //redirect to campground show page
            res.redirect('/campground/'+campground._id);
        } else {
            //insert comment to DB
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //push comment to comments array of the campground
                    campground.comments.push(comment);
                    //save campground
                    campground.save();
                    req.flash("success", "Comment added!");
                    //redirect to campground show page
                    res.redirect('/campground/'+campground._id);
                }
            });
        }
    });
});

//Comment Edit
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campId: req.params.id, comment: foundComment});
        }
    });
});

//Comment Update
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment update!");
            res.redirect("/campground/"+req.params.id);
        }
    });
});

//Comment Destroy
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, function(err) {
        req.flash("error", "Comment deleted!");
        res.redirect("/campground/"+req.params.id);
    });
});

module.exports = router;