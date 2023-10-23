const express= require("express");

let router = express.Router();

router.get("/new/regions/content",(req, res)=>{
    res.render("region_est.ejs",{time:new Date().toString()});
});

router.get("/new/regions/", async (req, res)=>{
    let resultat = await router.dbLayer.readAllRegions();
    res.json(resultat);
})

router.get("/new/districts/content",async (req, res)=>{
   res.render("district_est.ejs",{time:new Date().toString()});
    
});

router.get("/new/districts/",async (req, res)=>{
    //res.render("district_est.ejs",{time:new Date().toString()});
     let resultat = await router.dbLayer.readDistrictsByRegion(req.query.region)
    res.json(resultat);
});

router.get("/new/loclities/content",async (req, res)=>{
   res.render("loclities_est.ejs",{time:new Date().toString()});
});



module.exports=router