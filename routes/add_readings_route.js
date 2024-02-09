const express= require("express");
let b64ops = require("../base64json");
let router = express.Router();
let checker = require("./query_param_check");
var Tesseract = require('tesseract.js');

router.get("/add/start", async (req, res)=>{
    let estate = await router.dbLayer.readAddressesOfEstateByUser(res._userInfo.user_id);
    res.render("./new_readings/start.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:b64ops.objTobase64(estate), nonce: res.locals.nonce  });
});

router.get("/add/step2", async (req, res)=>{
    if(! checker.isSearchParamsExist(req.query, ["estate_id"])){
        res.sendStatus(400);
        return;
    }
    let results = await router.dbLayer.getCountersByEstate(req.query.estate_id);
    res.render("./new_readings/step2.ejs",{ time: new Date().toLocaleTimeString(), arrayOfAppData71:b64ops.objTobase64(results), nonce: res.locals.nonce   })
});

router.get("/add/step3", async (req, res)=>{
    let currentDate = new Date();
    let results = await router.dbLayer.readPreviousReadings(currentDate.getFullYear(), currentDate.getMonth()+1,  req.query.counter_id)
    if (results) {
      results = results.readings;
    } else {
        results="***";
    } 
     res.render("./new_readings/step3.ejs", { time: new Date().toLocaleTimeString(), previous: results })

}); 

router.get("/add/step3_ai", async (req, res)=>{
    let currentDate = new Date();
    let results = await router.dbLayer.readPreviousReadings(currentDate.getFullYear(), currentDate.getMonth()+1,  req.query.counter_id)
    if (results) {
      results = results.readings;
    } else {
        results="***";
    } 
     res.render("./new_readings/step3_ai.ejs", {  previous: results })

});

router.get("/add/finish", async (req, res)=>{
    let currentDate = new Date();
    let result = await router.dbLayer.writeOrUpdateReadings (req.query.counter_id,
                    req.query.readings, currentDate.getFullYear(), currentDate.getMonth() + 1);
    if(result){
             res.render("./new_readings/finish.ejs", {});
    }else{
             res.render("./user_error.ejs", {title:"application error", msg:"the data has not been written", time: new Date().toLocaleTimeString()});
    }
})

router.recognize = async function(data){
     const worker = await Tesseract.createWorker('eng');
  const ret = await worker.recognize(data);
  await worker.terminate();
  return ret.data.text
}

router.get("/add/rec1", (req, res)=>{
    res.json({date: new Date().toLocaleTimeString()})
})

router.post("/add/read_data",(req, res)=>{
res.json({data: Date.now()});
})

router.post("/add/rec1", async (req, res)=>{
    let recognized = await router.recognize(req.body);

    res.json({TXT: recognized});

});



module.exports=router;