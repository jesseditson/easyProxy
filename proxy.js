// Dependencies
// ------------

var cloneConfig = function(o){
  var r = {};
  for(var k in o){
    if(!o.hasOwnProperty(k)) continue;
    var t = typeof o[k];
    if(t === 'object'){
      r[k] = cloneConfig(o[k]);
    } else if(t !== 'function'){
      r[k] = o[k];
    }
  }
  return r;
}

var proxy = require('http-proxy'),
    config = cloneConfig(require('config')),
    fs = require('fs');
// Set up logger.
var logger = require('./lib/logger.js');

// **Check for https keys**
if(config.proxy.https && ['key','cert'].every(function(i){ return config.proxy.https[i].length; })){
  // if these have values, try to add in the keys
  try {
    config.proxy.https.key = fs.readFileSync(config.proxy.https.key);
    config.proxy.https.cert = fs.readFileSync(config.proxy.https.cert);
  } catch(e){
    delete config.proxy.https;
    logger.warn('Failed to read either key or certificate. (' + e.message + '). Not using https.');
  }
} else {
  delete config.proxy.https;
  logger.warn('Found an https key, but it appears to be misconfigured. Not using https.');
}

logger.log(config.proxy);

// **Http Proxy**
proxy.createServer(config.proxy).listen(config.port);