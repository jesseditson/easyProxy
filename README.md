#Easy Proxy

####This is a simple project aimed at making setting up a proxy in front of your shit a little easier.

It uses node-http-proxy, winston, and a config file to proxy from port 80 to 8080 out of the box, and prevent itself from crashing due to uncaught errors.

It also will be very loud if it crashes, both sending an SNS (so you can get a text, email, whatever), and sending logs to loggly when they are configured.

To customize, add a json file called "runtime.json" to the config folder with your environment specific variables.

Here is an example config file, with all the options specified:

```javascript
{
  "proxies" : [ // each of these will be directly passed in to node-http-proxy. Refer to the documentation [here](https://github.com/nodejitsu/node-http-proxy).
    {
      "port" : 80,
      "proxy" : {
        "hostnameOnly" : true,
        "router" : {
          "grazzee.com" : "127.0.0.1:8080",
          "www.grazzee.com" : "127.0.0.1:8080"
        },
        "https" : {
          "key" : "", // these should be paths to files - they will automatically be loaded at runtime
          "cert" : "" // same as above.
        },
        "maxSockets" : "100"
      }
    }
  ],
  "log_folder" : "../tmp/logs",
  "amazon" : { // if configured, these will send errors to amazon SNS
    "key" : "",
    "secret" : "",
    "id" : "",
    "topic" : ""
  },
  "loggly" : { // if configured, will send logs to loggly
    "auth" : {
      "username" : "",
      "password" : ""
    },
    "subdomain" : "",
    "inputName" : ""
  }  
}
````