var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var path = "list.kae";
var debug = 1;
module.exports = function(f,callback){
  var arg2 =  f.domain;
  var arg3 = f.selector;
  var watch_details ={};
  //console.log(arg2+arg3);
  if(arg2 != undefined && arg3 != undefined){
    console.log(arg2+" "+arg3);
    request(arg2,function(err,res,html){
      debug && console.log("Status Code :"+res.statusCode);
      if(!err && res.statusCode == 200){
        var $ = cheerio.load(html);
        var count = $(arg3).length;
        console.log("Found #"+count+" number of "+arg3);
        var str = arg2+'$'+arg3+'$'+new Date().toLocaleString()+"%";
        if(!fs.existsSync(path) && f.write){
          fs.writeFile(path, str, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Saved file at "+__dirname+"\\"+path);
          });
        }else{
          fs.appendFile(path, str, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("appended file at "+__dirname+"\\"+path);
          });
        }
      watch_details = {
          "domain" : arg2,
          "selector" : arg3,
          "count" : count
        };
        callback(watch_details);
      }else {
        console.log(err);
      }
    });
  }else{
    console.log("Error : Url missing");
  }
}
