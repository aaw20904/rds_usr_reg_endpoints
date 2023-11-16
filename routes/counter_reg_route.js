const express= require("express");

let router = express.Router();

 //router.dbLayer.isRegionCapital(req.query.region);
//select object of esatate firstly

router.get("/new/content", async (req, res)=>{
    let estate = await router.dbLayer.readAddressesOfEstateByUser(res._userInfo.user_id);
  res.render("counter_reg_start.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:JSON.stringify(estate) });
});

router.get("/new/step2", async (req, res)=>{ 
  let counterTypes = await router.dbLayer.readCounterTypes();
  res.render("counter_reg_step2.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:JSON.stringify(counterTypes) });
 // res.json(req.query);
})

router.get("/new/step3", async (req, res)=>{
  res.render("counter_reg_step3.ejs",{ time: new Date().toLocaleTimeString() });
});

router.post("/new/finish",async (req, res)=>{
  res.json(req.body);
  /*
  	
factory_num	"877764"
estate_id	"43"
counter_type	"1"
   */
})


module.exports=router;