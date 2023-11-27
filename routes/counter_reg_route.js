const express= require("express");
let b64ops = require("../base64json");
let router = express.Router();

 //router.dbLayer.isRegionCapital(req.query.region);
//select object of esatate firstly

router.get("/new/content", async (req, res)=>{
    let estate = await router.dbLayer.readAddressesOfEstateByUser(res._userInfo.user_id);
  res.render("./counter_reg/counter_reg_start.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:b64ops.objTobase64(estate), nonce: res.locals.nonce  });
});

router.get("/new/step2", async (req, res)=>{ 
  let counterTypes = await router.dbLayer.readCounterTypes();
  res.render("./counter_reg/counter_reg_step2.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:b64ops.objTobase64(counterTypes), nonce: res.locals.nonce  });
 // res.json(req.query);
})

router.get("/new/step3", async (req, res)=>{
  res.render("./counter_reg/counter_reg_step3.ejs",{ time: new Date().toLocaleTimeString(), nonce: res.locals.nonce  });
});

router.post("/new/finish",async (req, res)=>{
let result =  await router.dbLayer.registerCounterOfUser(req.body.estate_id, 
                                            req.body.counter_type,
                                              req.body.factory_num,
                                              req.body.verified   );
          if (result.status) {
            res.render("./counter_reg/counter_reg_finish.ejs",{});
            return;
          } else if(result.duplicated) {
            res.statusCode = 409;
            res.render("incorrect_info.ejs",{msg:"The estate object contains the same type of counters with the same factory number.It is not alowed.",time: new Date().toLocaleTimeString()})
          } else {
                        res.statusCode = 500;
                        res.render("incorrect_info.ejs",{msg:"Server error",time: new Date().toLocaleTimeString()})

          }

  
    /*
      
  factory_num	"877764"
  estate_id	"43"
  counter_type	"1"
    */
});


module.exports=router;