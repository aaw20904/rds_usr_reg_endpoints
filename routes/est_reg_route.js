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
//! please write exception code with 503 code - when region is undefined! 
router.get("/new/districts/",async (req, res)=>{
    //res.render("district_est.ejs",{time:new Date().toString()});
     let resultat = await router.dbLayer.readDistrictsByRegion(req.query.region)
    res.json(resultat);
});

router.get("/new/localities/content",async (req, res)=>{
   res.render("localities_est.ejs",{time:new Date().toString()});
});

router.get("/new/localities/",async (req, res)=>{
    //res.render("district_est.ejs",{time:new Date().toString()});
     let resultat = await router.dbLayer.readLocalityParams(req.query.region, req.query.district);
    res.json(resultat);
});

router.get("/new/streets/content",async (req, res)=>{
    res.json(req.query);
   //res.render("loclities_est.ejs",{time:new Date().toString()});
});


module.exports=router