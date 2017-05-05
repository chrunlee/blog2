var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
    var q = req.query;
    var a = q.a,b= q.b;
    var r = parseInt(a,10) * parseInt(b,10);
    res.end(r+'');
});

module.exports = router;