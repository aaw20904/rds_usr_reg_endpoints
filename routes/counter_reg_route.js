const express= require("express");

let router = express.Router();

 //router.dbLayer.isRegionCapital(req.query.region);
//select object of esatate firstly

router.get("/new/content", async (req, res)=>{
  res.render("counter_reg_start.ejs",{ time: new Date().toLocaleTimeString(), dataArray:[1,2,3]});
});



module.exports=router;