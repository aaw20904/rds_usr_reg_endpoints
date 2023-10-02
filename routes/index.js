const accessControl = require('./access_token_check');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get(`/www`, async (req, res)=>{
   await accessControl.checkAccessToken(req,res);
})

module.exports = router;
