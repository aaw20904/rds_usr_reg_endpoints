const express = require("express");
let router =  express.Router();

router._sendQueryToAuthServer = function(){

}

router.get("/content",(req,res)=>{
    res.render("login.ejs");
})


router.post("/", (req,res)=>{
    res.json(req.body);
})

module.exports=router;