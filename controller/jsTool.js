//这里控制关于javascript相关的路由
var express = require('express');
var UglifyJS = require('uglify-js');
var appDao = require('../dao/AppDao');
var router = express.Router();

router.get('/uglify',function(req,res,next){
    appDao.getById('1',function(data){
        res.render('js/uglify',{app : data[0]});
    })
    
    
});
router.post('/compress',function(req,res,next){
    var content = req.body.content.toString();
    var type = req.body.type;
    if(content && content != ''){
        //处理压缩JS
        var toplevel = UglifyJS.parse(content);
        // var compressor = UglifyJS.Compressor({ warnings: false });
        // console.log('11111');
        // var compressed_ast = toplevel.transform(compressor);
        // // var compressed_ast = compressor.compress(toplevel);
        // console.log('22222');
        // // compressed_ast.figure_out_scope();
        // compressed_ast.compute_char_frequency();
        // console.log('33333');
        // compressed_ast.mangle_names();
        // console.log('44444');
        var options = {
            width : 200
        };
        if(type === 'yasuo'){//仅仅是压缩，不混淆
            
        }else if(type === 'hunxiao'){
            
            var mangle = {
                toplevel  : true ,
                keep_fnames  : false
            };
            toplevel.figure_out_scope(mangle);
            toplevel.compute_char_frequency(mangle);
            toplevel.mangle_names(mangle);
        }else if(type === 'meihua'){
            options.beautify = true;
            options.comments = true;
        }else if(type === 'comment'){
            options.beautify = true;
            options.comments = false;
        }
        var stream = UglifyJS.OutputStream(options);
        toplevel.print(stream);
        var code = stream.toString(); // this is your minified code
        res.end(code);
    }else{
        res.end(JSON.stringify({
            success : false,
            msg : '传参错误'
        }));
    }
});

module.exports = router;