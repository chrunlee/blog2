var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
    res.render('collect/index');
});

module.exports = router;