var proxy = require('express-http-proxy');
var app = require('express')();
var http = require('http');
 
app.use('/*', proxy('api.famousfootwear.com', {
  forwardPath: function(req, res) {
    return require('url').parse(req.originalUrl).path;
  },
  intercept: function(rsp, data, req, res, callback) {

    res.header("Access-Control-Allow-Origin", req.headers.origin);
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		res.header("Access-Control-Allow-Credentials", "true");

		/* SET COOKIES ON LOCALHOST // THESE COME THROUGH AS DUPLICATES --- */
		var cookies = rsp.headers['set-cookie'];
    if (typeof(cookies) !== 'undefined') {
    	for (var i=0;i<cookies.length;i++){
	    	var opt = cookies[i].split(';');
		    opt.shift();
		    opt_o = {};
		    for (var j=0;j<opt.length;j++) {
		    	var pairs = opt[j].replace(/^\s+|\s+$|;/,'').split('=');
		    	if (/domain/i.test(pairs[0])) {
		    		pairs[1] = pairs[1].replace(/\.?[A-z]+\.com/i, 'localhost');
		    	} else if (/expire/i.test(pairs[0])) {
		    		pairs[1] = new Date(pairs[1]);
		    	}
		    	opt_o[ pairs[0] ] = pairs[1];
		    }
		    var nameVal = cookies[i].split(';')[0];
		    res.cookie(nameVal.split('=')[0], nameVal.split('=')[1], opt_o);
	    }
    }
    /* //end SET COOKIES ON LOCALHOST --- */

		callback(null, data);
  }
}));

app.set('port', process.env.PORT || 8080);
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});