//签到
phantom.outputEncoding = 'utf-8';
var d = new Date();
var y = d.getYear()+1900;
var m = d.getMonth()+1;
var dd = d.getDate();
var str = y+'-'+m+'-'+dd;
var account = {
	qq : {
		u : '735394843',
		p : 'lixun594839788'
	},
	cto : {
		u : 'chrunlee@foxmail.com',
		p : 'xungege5354'
	}
};

var url1 = 'http://wenku.baidu.com/task/browse/daily';
var baidu = {
	url1 : 'http://wenku.baidu.com/user/mydocs',
	url : 'http://wenku.baidu.com/task/browse/daily',
	cookie : 'BAIDUID=66815CCB71EC3C764D776F5E3A681BAD:FG=1; wkview_gotodaily_tip=1; bdshare_firstime=1478653621303; grownupTaskFinish=bruceleexun%7C0; wk_shifen_pop_window=3338_2_1479259265047; WK_daily_signIn=62727563656c656578756e; LoseUserAllPage=%7B%22status%22%3A1%2C%22expire_time%22%3A0%2C%22create_time%22%3A1479263493%2C%22type%22%3A0%2C%22cookie_time%22%3A1479522693%7D; BDUSS=nFWM05PUjdjOUVuMXBXZzZvUTZQfmhwN25qenpvTGwwTjVXdkZwQ1lXR0FVbE5ZSVFBQUFBJCQAAAAAAAAAAAEAAADH52gFYnJ1Y2VsZWV4dW4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDFK1iAxStYQ; BIDUPSID=66815CCB71EC3C764D776F5E3A681BAD; PSTM=1479263640; Hm_lvt_f4165db5a1ac36eadcfa02a10a6bd243=1479263728; Hm_lpvt_f4165db5a1ac36eadcfa02a10a6bd243=1479263728; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; PSINO=2; H_PS_PSSID=1440_12897_17942_21112_21455_21408_21377_21526_21193_21339; PMS_JT=%28%7B%22s%22%3A1479264048726%2C%22r%22%3A%22http%3A//wenku.baidu.com/user/mydocs%22%7D%29; Hm_lvt_d8bfb560f8d03bbefc9bdecafc4a4bf6=1479098654,1479125380,1479259256,1479264038; Hm_lpvt_d8bfb560f8d03bbefc9bdecafc4a4bf6=1479264050',
	cookie2: 'BAIDUID=66815CCB71EC3C764D776F5E3A681BAD:FG=1; IK_CID_77=3; IK_CID_85=1; IK_66815CCB71EC3C764D776F5E3A681BAD=22; IK_CID_74=18; BDUSS=nFWM05PUjdjOUVuMXBXZzZvUTZQfmhwN25qenpvTGwwTjVXdkZwQ1lXR0FVbE5ZSVFBQUFBJCQAAAAAAAAAAAEAAADH52gFYnJ1Y2VsZWV4dW4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDFK1iAxStYQ; BIDUPSID=66815CCB71EC3C764D776F5E3A681BAD; PSTM=1479263640; Hm_lvt_f4165db5a1ac36eadcfa02a10a6bd243=1479263728; Hm_lpvt_f4165db5a1ac36eadcfa02a10a6bd243=1479263728; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; PSINO=2; H_PS_PSSID=1440_12897_17942_21112_21455_21408_21377_21526_21193_21339; Hm_lvt_6859ce5aaf00fb00387e6434e4fcc925=1479193355,1479260711,1479263787,1479266523; Hm_lpvt_6859ce5aaf00fb00387e6434e4fcc925=1479266523',
	cookie3 : 'BAIDUID=66815CCB71EC3C764D776F5E3A681BAD:FG=1; bdshare_firstime=1478432509092; BDUSS=nFWM05PUjdjOUVuMXBXZzZvUTZQfmhwN25qenpvTGwwTjVXdkZwQ1lXR0FVbE5ZSVFBQUFBJCQAAAAAAAAAAAEAAADH52gFYnJ1Y2VsZWV4dW4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDFK1iAxStYQ; BIDUPSID=66815CCB71EC3C764D776F5E3A681BAD; PSTM=1479263640; Hm_lvt_f4165db5a1ac36eadcfa02a10a6bd243=1479263728; Hm_lpvt_f4165db5a1ac36eadcfa02a10a6bd243=1479263728; Hm_lvt_46c8852ae89f7d9526f0082fafa15edd=1479188766,1479260696,1479265432,1479268460; Hm_lpvt_46c8852ae89f7d9526f0082fafa15edd=1479268460; BDRCVFR[eZLhj6h0pMs]=mbxnW11j9Dfmh7GuZR8mvqV; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; PSINO=2; H_PS_PSSID=1440_12897_17942_21112_21455_21408_21377_21526_21193_21339; PS_REFER=0',
	cookie4 : ''
};
var casper = require('casper').create({
	verbose: true,
	stepTimeout : 50000,
    logLevel: "error",//debug
    pageSettings: {
         loadImages:  true,        
         loadPlugins: true,    
         userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.36'
    }
});
casper.options.waitTimeout = 20000;
var addCookie = function(cks,domain){
	cks.split(";").forEach(function(pair){
	    pair = pair.split("=");
	    if(pair[0] == 'BAIDUID' || pair[0] =='BDUSS' || pair[0].indexOf('BDRCVFR')>-1){
	    	domain = '.baidu.com'
	    }
	    phantom.addCookie({
	      'name': pair[0],
	      'value': pair[1],
	      'domain': domain
	    });
	});
};
casper.start();
console.log('\r\n');

//-------------百度文库签到开始----------------//
/****/

addCookie(baidu.cookie,baidu.domain);
casper.start().thenOpen(baidu.url,function(){
	this.echo('进入文库个人中心首页');
	// this.debugHTML();
	if(this.exists('#upload-tips')){
		this.click('#upload-tips>.btn');
	}
});

casper.wait(3000,function(){
	// this.capture('abcd.png');
	if(this.exists('span.js-signin-btn')){
		this.click('span.js-signin-btn');	
		this.echo('点击签到，签到结束');
	}
});
casper.wait(6000,function(){
	this.captureSelector('img/'+str+'-wenku.png','#signin');
	this.echo('百度文库签到完毕截图成功');
});

//-------百度文库签到完毕----------------//
//-------百度知道签到开始----------------//
/****/
casper.then(function(){
	addCookie(baidu.cookie2,'zhidao.baidu.com');	
	console.log('添加百度知道cookie');
});
casper.thenOpen('https://zhidao.baidu.com/',function(){
	this.waitForSelector('.go-sign-in',function(){
		//等待签到
		this.echo('进入百度知道首页');
		this.click('.go-sign-in');
	});
});

casper.then(function(){
	this.waitForSelector('#sign-in-btn',function(){});
});

casper.wait(3000,function(){
	this.evaluate(function(){
		var btn = document.getElementById('sign-in-btn');
		btn.click();
	});
	this.echo('点击签到，签到结束');
});

casper.wait(6000,function(){
	this.capture('img/'+str+'-zhidao.png');
	this.echo('百度知道签到完毕截图成功');
});

//-------------百度知道签到完毕-----------------//

//-----------51cto 签到------------------//

casper.thenOpen('http://home.51cto.com/index?reback=http://www.51cto.com/',function(){
	this.fillSelectors('#login-form',{
		'#loginform-username':account.cto.u,
		'#loginform-password':account.cto.p
	});
	this.evaluate(function(){
		$('input[name="login-button"]').click();
	});
});
casper.wait(5000,function(){this.echo('登录51cto..');});
casper.thenOpen('http://down.51cto.com/credits',function(){
	this.waitForSelector('#jsGetCredit',function(){
		this.evaluate(function(){
			$('#jsGetCredit').click();
		});
	});
});
casper.wait(9000,function(){
	this.echo('51cto领取下载豆结束');
	this.capture('img/'+str+'-51.png');
});

//-----------------51cto 签到结束---------//

//-------------腾讯cf 签到开始------------------//
casper.thenOpen('http://daoju.qq.com/mall/judou.shtml?sBizCode=cf',function(){
	this.echo('进入cf聚豆页面');
});
casper.then(function(){
	this.click('#unlogin a');	
});
casper.withFrame('loginIframe',function(){
	this.echo('开始登录');
	this.evaluate(function(){
		document.getElementById('switcher_plogin').click();
	});
	this.fillSelectors('#loginform',{
		'#u':'735394843',
		'#p':'lixun594839788'
	});
	this.click('#login_button');
});
casper.wait(3000,function(){
	console.log('登录成功，签到')
	this.click('.sign-btn');
	this.wait(2000,function(){
	})
});
casper.wait(5000,function(){
	this.reload();
});
casper.then(function(){
	this.click('.btn_dh');
	this.wait(5000,function(){
		this.capture('img/'+str+'-cf.png');
		this.echo('腾讯CF聚逗签到成功截图');
	});
});

//-------------腾讯cf 签到结束-------------------//

//-----------腾讯登录领Q币-------------//

// casper.thenOpen('http://www.gad.qq.com/act/jianianhua',function(){
// 	this.waitForSelector('a.loginbtn',function(){
// 		this.evaluate(function(){
// 			$('.loginbtn').click();
// 		});
// 	});
// });
// casper.withFrame(0,function(){
// 	this.withFrame(0,function(){
// 		this.evaluate(function(){
// 			document.getElementById('switcher_plogin').click();
// 		});
// 		this.fillSelectors('#loginform',{
// 			'#u' : account.qq.u,
// 			'#p' : account.qq.p
// 		});
// 		this.evaluate(function(){
// 			document.getElementById('login_button').click();
// 		});
// 	});
// });
// casper.wait(8000,function(){
// 	//点击送信
// 	this.click('.icon-carnival_btn_bg2');
// 	this.capture('cc.png');
// });
// casper.wait(5000,function(){
// 	this.capture('c.png');
// 	this.fillSelectors('#loginform',{
// 		'#u':'735394843',
// 		'#p':'lixun594839788'
// 	});

// });
//-----------腾讯登录领Q币-------------//

//-------------淘宝金币签到开始-----------------//
// console.log('开始淘宝金币签到');
// casper.thenOpen('https://login.taobao.com/member/login.jhtml?spm=a217e.7256925.754894437.1.0mObhI&f=top&redirectURL=https%3A%2F%2Ftaojinbi.taobao.com%2Findex.htm',function(){
// 	this.echo('登录淘宝');
// 	this.waitForSelector('#TPL_username_1',function(){
// 		this.fillSelectors('#J_Form',{
// 			'#TPL_username_1' : '15610311160',
// 			'#TPL_password_1' : '0.0xungege5354?~~.'
// 		});
// 		this.click('#J_SubmitStatic');
// 	});
// });
// casper.wait(6000,function(){
// 	this.capture('login.png');
// 	this.waitForSelector('.J_GoTodayBtn',function(){
// 		this.click('.J_GoTodayBtn');
// 		this.echo('点击签到，签到结束');//这里需要滑动图片
// 	});
// });
// casper.wait(3000,function(){
// 	this.capture('click.png');
// 	this.echo('淘宝签到结束成功截图');
// });

//-------------淘宝金币签到结束----------------//

//-------------京东京豆签到开始----------------//


//-------------京东京豆签到结束--------------//

//-------------------程序结束-------------------//
casper.run(function(){
	this.echo('签到过程结束');
	this.die('over',1);
});