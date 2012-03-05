// Dependencies
// ------------

var proxy = require('http-proxy'),
  config = require('config'),
  fs = require('fs');
  
// Set up logger.
var logger = require('./lib/logger.js');

config.proxies.forEach(function(conf){
  // **Check for https keys**
  if(conf.proxy.https && ['key','cert'].every(function(i){ return conf.proxy.https[i].length; })){
    // if these have values, try to add in the keys
    try {
      conf.proxy.https.key = fs.readFileSync(conf.proxy.https.key);
      conf.proxy.https.cert = fs.readFileSync(conf.proxy.https.cert);
    } catch(e){
      delete conf.proxy.https;
      logger.warn('Failed to read either key or certificate. (' + e.message + '). Not using https.');
    }
  } else {
    delete conf.proxy.https;
    logger.warn('Found an https key, but it appears to be misconfigured. Not using https.');
  }

  logger.log(conf.proxy);

  // **Http Proxy**
  proxy.createServer(conf.proxy).listen(conf.port);
});