const express= require("express");

let router = express.Router();

router.get("/new/regions/content",(req, res)=>{
    res.render("region_est.ejs",{time:new Date().toString()});
})

module.exports=router