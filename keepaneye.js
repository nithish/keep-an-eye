var nw = require('node-windows');
var addWatch = require('./watch.js');
var Service = nw.Service;
var EventLogger = nw.EventLogger;
var args = process.argv;
var arg1 = args[2];
var debug = 1;
var path = "list.kae";
console.log("Checking...");
var f = {
  'domain' : args[3],
  'selector' : args[4],
  'write' : 'Y'
}
switch(arg1){
  case "watch":
    addWatch(f,create_service);
    break;
  case "list":
    listWatches();
    break;
  default :
    console.log("Operation not recognised");
}
function create_service(watch_details){
  var service_name = watch_details.domain.split('.')[1];
  var log = new EventLogger(service_name);
  var service_desc = {
    name : service_name,
    description : 'Service to monitor '+service_name+' for updates',
    script: 'N:\\Git-Repo\\Keep-an-eye\\track.js',
    env :[{
      name : 'watch_details',
      value : JSON.stringify(watch_details)
    }]
  };
  debug && console.log(service_name);
  //debug && console.log(service_desc);
  var svc = new Service(service_desc);
  svc.on('install',function(){
    svc.start();
    debug && console.log("Service Has been installed");
  });
  svc.on('start',() =>{
    console.log("Started.");
  });
  svc.on('error',()=>{
    console.log("Error in starting up service");
  });
  svc.on('stop',()=>{
    console.log("Stopped");
  });
  svc.on('alreadyinstalled',()=>{
    console.log("alreadyinstalled");
  });
svc.install();
log.info("Hello");
}
function listWatches(){
  if(fs.existsSync(path)){
    fs.readFile(path,(err,fd) =>{
      if(err)
        console.log(err);
      else {
        var lines = fd.toString().split("%");
        for(var i = 0;i<lines.length-1;i++){
          var fields = lines[i].split("$");
          console.log(fields[0]+'\t'+fields[1]+'\t'+fields[2]);
        }
      }
    });
  }
}
