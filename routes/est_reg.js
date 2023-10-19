const express= require("express");

let router = express.Router();

router.get("/new/regions/content",(req, res)=>{
    res.render("region_est.ejs",{time:new Date().toString()});
});

router.get("/new/regions/", async (req, res)=>{
    let resultat = await router.dbLayer.readAllRegions();
    res.json(resultat);
})


module.exports=router