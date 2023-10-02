const accessControl = require('../access_token_check');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get(`/www`, async (req, res)=>{
   await accessControl.checkAccessToken(req, res);
    if (!res._userInfo) {
      res.redirect("../login/content");
      return;
    }

   switch (res._userInfo.statusCode) {
    case 404:
     res.render("wrong_data",{msg:"authorization server  unavaliable", time: new Date().toLocaleTimeString()});
    break;
    case 403:
     res.redirect("../login/content");
    break;
    case 200:
     res.cookie('token',res._userInfo.token);
     res.redirect('../');
    break;
   }
})

module.exports = router;
