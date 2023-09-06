var express = require('express');
var router = express.Router();

router.get("/content", (req, res)=>{
    res.render("register.ejs");
});




module.exports = router;