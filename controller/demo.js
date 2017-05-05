var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
    res.render('speedUI/index');
});

module.exports = router;