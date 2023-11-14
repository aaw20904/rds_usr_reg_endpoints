const express= require("express");

let router = express.Router();

 //router.dbLayer.isRegionCapital(req.query.region);
//select object of esatate firstly

router.get("/new/content", async (req, res)=>{
    let estate = await router.dbLayer.readAddressesOfEstateByUser(res._userInfo.user_id);
  res.render("counter_reg_start.ejs",{ time: new Date().toLocaleTimeString(), dataObject:"helloword" });
});



module.exports=router;