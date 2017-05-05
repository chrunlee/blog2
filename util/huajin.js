phantom.outputEncoding = 'utf-8';
var spawn = require('child_process').spawn;
var d = new Date();
var y = d.getYear()+1900;
var m = d.getMonth()+1;
var dd = d.getDate();
var str = y+'-'+m+'-'+dd;
var casper = require('casper').create({
		verbose: true,
	    logLevel: "error",//debug
	    pageSettings: {
	         loadImages:  true,        
	         loadPlugins: true,    
	         userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.36'
	    }
	});
	casper.start();
function tempLogin(){
	console.log('进入登录.....');
	var code = '';
	casper.thenOpen('https://www.huajinzaixian.com/LoginManage_toLogin.do',function(){
		//获得验证码，并识别
		this.waitForSelector('#kaptchaImage',function(){
			this.captureSelector('code.png','#kaptchaImage');
			//截图结束，获取图片上传，并获得返回值，然后在本页面填写
			var child = spawn('python',['getcode.py','code.png']);
			child.stdout.on('data',function(data){
				code = data;
			});
		});
	});
	casper.wait(1000,function(){
		this.echo('验证码：'+code);
		//start fill 
		this.fillSelectors('#cust1Form',{
			'#cust_name' : 'chrunlee',
			'#cust_pw' : 'xungege5354'
		});
		this.sendKeys('#userpwd',code);
		this.wait(1000,function(){
			this.evaluate(function(){
				document.getElementById('btnLogin').click();
			});
		});
		// this.click('#btnLogin');	
	});
	casper.then(function(){
		//如果没有登录成功，则重新来一遍？直到登录成功？
		this.wait(4000,function(){
			if(this.getTitle().indexOf('登录') > -1){
				console.log('登录失败,重新运行....');
				this.wait(10000,function(){
					tempLogin();		
				});
			}else{
				casper.thenOpen('https://www.huajinzaixian.com/WdzhWdzyManage_toMyHome.action',function(){
					this.waitForSelector('.Personal_data_01',function(){
						this.click('.Personal_data_01>a');
					});
				});
				casper.thenOpen('https://www.huajinzaixian.com/PointsExchangeManage_toMyPoints.action',function(){
					this.waitForSelector('.survey',function(){
						this.captureSelector('img/'+str+'-lixun-huajin.png','.survey');
						this.echo('积分截图成功');
					});
				});
			}
		});
	});

	casper.run(function(){
		this.exit();
	});
};
// tempLogin();