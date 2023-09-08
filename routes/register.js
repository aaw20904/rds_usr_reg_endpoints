var express = require('express');
var router = express.Router();

router.get("/content", (req, res)=>{
    res.render("register.ejs");
});

router.post("/",(req, res)=>{
    res.render("check_mail_reg.ejs",{date:new Date().toString()})
    //res.json(JSON.stringify(req.body));
})




module.exports = router;