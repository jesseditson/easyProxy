// Dependencies
// ------------
var path = require('path'),
  fs = require('fs'),
  winston = require('winston'),
  SNS = require('winston-sns'),
	config = require('config');

// Local Variables
var amazon = config.amazon,
  log_folder = config.log_folder,
  loggly = config.loggly;

// Helpers
var mkdirpSync = function(dir,pre){
  var pre = pre || ".",
    parts = dir.split('/'),
    top = parts.shift();
  if(top && !path.existsSync(top)){
    fs.mkdirSync(pre + "/" + top);
    if(path) mkdirpSync(parts.join('/'),top);
  }
}

// make sure our log folder exists
if(!path.existsSync(log_folder)){
  mkdirpSync(log_folder);
}

// Set up our options
var options = {
  	"exitOnError" : false,
  	"transports" : [
      // Defaults to logging to a file specified in the config, and a console.
  		new (winston.transports.Console)({ "colorize" : true, "level" : "info", "silent" : false, "timestamp" : true }),
  		new (winston.transports.File)({ "filename" : log_folder + "/log.log", "timestamp" : true, "level" : "info" })
  	],
  	"exceptionHandlers": [
      new (winston.transports.Console)({ "colorize" : true, "level" : "info", "silent" : false, "timestamp" : true }),
  		new (winston.transports.File)({ "filename": log_folder + "/exceptions.log", "timestamp" : true })
  	]
  };

// Create the winston instance
var logger = new (winston.Logger)(options);

// Add-Ons
// -------

// **Amazon SNS notifications**
// If provided, this will use amazon sns to notify you if the proxy hits an uncaught exception.

// require some config stuff
if(!amazon || ['key','secret','id','topic'].some(function(i){ return !amazon[i] || !amazon[i].length; })){
  logger.warn("Amazon SNS notification on error is turned off. You must provide a key, secret, id, and topic to use this feature.");
} else {
  // set up notification options
  var snsConfig = { "aws_key" : amazon.key, "aws_secret" : amazon.secret, "subscriber" : amazon.id, "topic_arn" : amazon.topic,"level":"error", "handleExceptions" : true};
  logger.add(new (winston.transports.SNS)(snsConfig));
  logger.handleExceptions(new (winston.transports.SNS)(snsConfig));
}

// **Loggly Config**
// If provided, this will use loggly for logging.

// require some stuff
if(!loggly || ['subdomain','auth','inputName'].some(function(i){ return !loggly[i] || !loggly[i].length; })){
  logger.warn("Loggly logging is turned off. To use this feature, provide a loggly subdomain, auth and inputName.");
} else {
  logger.add(new (winston.transports.Loggly)({ "level" : "info", "subdomain" : loggly.subdomain, "auth" : loggly.auth, "inputName" : loggly.inputName, "json" : false}));
}

// If logger itself throws an error, don't re-throw.
logger.on('error',function(err){
		/// in production, don't throw this error.
		console.error("Logger threw an error: " + err.message);
});

// export the module.
module.exports = logger;
