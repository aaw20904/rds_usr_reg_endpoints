var express = require('express');
var router = express.Router();

router.get("/content", (req, res)=>{
    res.render("register.ejs");
});

router.post("/",(req, res)=>{
    res.json(JSON.stringify(req.body));
})




module.exports = router;