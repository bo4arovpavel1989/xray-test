var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'xray-test',
  description: 'Test for detecting weapons in laggage',
  script: 'index.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();