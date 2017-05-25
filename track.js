const wn = require('node-notifier').WindowsToaster;
var watch = require('./watch.js');
var env = process.env;
var path = "log.kae";
var watch_details = JSON.parse(env['watch_details']);
setInterval(function(){
  watch(watch_details,wnotify);
},10000);//3600000
function wnotify(new_det){
  if(new_det.count != watch_details.count){
    var msg = "Domain "+new_det.domain+" has a new entry.Current Count :"+new_det.count+" Old count :"+watch_details.count;
    var notifier = new wn({
      withFallback: true
    });
    notifier.notify({
      title: "New Entry Detected",
      message: msg,
      sound: true,
      wait: false
      }, function(error, response) {
      console.log(response);
    });
  }
}
