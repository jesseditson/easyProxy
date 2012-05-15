// Helpers/config
// --------------

// deep clone a config file
var cloneConfig = function(o){
  var r = {};
  for(var k in o){
    if(!o.hasOwnProperty(k)) continue;
    var t = typeof o[k];
    if(t === 'object' && !Array.isArray(o[k])){
      r[k] = cloneConfig(o[k]);
    } else if(t !== 'function'){
      r[k] = o[k];
    }
  }
  return r;
}

var path = require('path'),
    configPath = process.argv[2];

if(configPath && path.existsSync(configPath)){
  process.env.NODE_CONFIG_DIR = configPath;
}

// Dependencies
// ------------

var proxy = require('http-proxy'),
    config = cloneConfig(require('config')),
    fs = require('fs');
// Set up logger.
var logger = require('./lib/logger.js');

logger.debug('loaded proxies',JSON.stringify(config.proxies));

config.proxies.forEach(function(conf){
  // **Check for https keys**
  if(conf.proxy.https && conf.proxy.https.key && conf.proxy.https.cert && ['key','cert'].every(function(i){ return conf.proxy.https[i].length; })){
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

  logger.silly(conf.proxy);

  // **Http Proxy**
  logger.debug("Starting Proxy on Port " + conf.port);
  proxy.createServer(conf.proxy).listen(conf.port);
});
