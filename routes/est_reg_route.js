const express= require("express");

let router = express.Router();

router._isSearchParamsExist = (query, listOfProps=["property1", "property2", "property3"]) => {
      //get properties (query params) that exists in the query
    let queyProps = Object.keys(query);
      //convert query props to the Set
    let querySet = new Set(queyProps);
      //checking - all the given properties exists in a query
   return listOfProps.every( (val)=>{
       return querySet.has(val);
    });

}

router.get("/new/regions/content",(req, res)=>{
    res.render("./estate_reg/region_est.ejs",{ time: new Date().toString()} );
});

router.get("/new/regions/", async (req, res)=>{
    let resultat = await router.dbLayer.readAllRegions();
    res.json(resultat);
})

router.get("/new/districts/content", async (req, res)=>{
    //checking - is the regions a city? 
    //Kyiv and Sevastopol IDs - 26, 27
     let resultat =  router.dbLayer.isRegionCapital(req.query.region);
     if(resultat){
        //when capital cities - redirect
        res.redirect(`/estate/new/streets/content?region=${req.query.region}`);
        return;
     }
   res.render("./estate_reg/district_est.ejs",{time:new Date().toString()});
    
});

router.get("/new/districts/",async (req, res)=>{
    //res.render("district_est.ejs",{time:new Date().toString()});
     let resultat = await router.dbLayer.readDistrictsByRegion(req.query.region);
   
    res.json(resultat);
});

router.get("/new/localities/content",async (req, res)=>{
   res.render("./estate_reg/localities_est.ejs",{time:new Date().toString()});
});

router.get("/new/localities/",async (req, res)=>{
    //res.render("district_est.ejs",{time:new Date().toString()});
     let resultat = await router.dbLayer.readLocalitiesByParams(req.query.region, req.query.district);
    res.json(resultat);
});

router.get("/new/streets/",async (req, res)=>{
    //is the locality Kyiv or Sevastopol?
    if (req.query.region) {
        let result = await router.dbLayer.readStreetsOfCapitalCities(req.query.region);
        res.json(result);
        return;
    }
    let resultat = await router.dbLayer.readStreetsByLocID(req.query.locality);
    res.json(resultat);
  
   //res.render("loclities_est.ejs",{time:new Date().toString()});
});


router.get("/new/streets/content", async (req, res)=>{
    res.render("./estate_reg/streets_est.ejs", {time:new Date().toString()});
});

router.get("/new/building/content", async (req, res)=>{
    //res.json(req.query);
    res.render("./estate_reg/building_est.ejs",{time:new Date().toString()});
});

router.get("/new/flat/content", async (req, res)=>{
  res.render("./estate_reg/flat_est.ejs",{time:new Date().toString()})
})

router.get("/new/finish", async (req, res)=>{
    let result;
    
       
      result = await router.dbLayer.readLocalityRegistrationDataByIDs(  req.query.locality,
                                                                        req.query.street_type, 
                                                                        req.query.street_id, );
     
    result=result[0];
    
     res.render("./estate_reg/finish_est.ejs",{time:new Date().toString(),
        region: result.region,
        district: result.district,
        street: result.street,
        street_type: result.street_type,
        locality: result.locality,
        loc_type: result.locality_type,
        building: req.query.building,
        flat: req.query.flat
        }) 
     
 //res.json(req.query);
})

router.get("/new/finish/insert", async (req, res)=>{

      if(! router._isSearchParamsExist(req.query, ["locality","street_type","street_id","building","flat"])){
        res.statusCode = 400;
        res.end("BAD request!");
        return
      }

    try{
       let result = await router.dbLayer.insertRealEstateInDB ( req.query.locality, 
                                              req.query.street_type, 
                                              req.query.street_id, 
                                              req.query.building, 
                                              Number(req.query.flat),
                                              res._userInfo.user_id );
    //returns an object with query results
        if (result.success) {
            res.statusCode=201;
            res.render("./estate_reg/est_registered.ejs",{time:new Date().toString()});
            return;
        } else if(result.duplicate){
            res.statusCode = 400;
            res.render("incorrect_info.ejs", {time:new Date().toString(),msg:"The given object estate already exists!"});
            return;
        } else {
            res.statusCode=500;
            res.end("internal server error");
            return;
        }
        
        
    } catch(e){
        res.statusCode=500;
        res.end("Internal server error!");
    }
   


});


module.exports=router