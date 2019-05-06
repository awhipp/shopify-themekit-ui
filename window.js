$(() => {
  $('.theme-row').hide();
  $("#download").hide();

  const exec = require('child_process').exec;
  const fs = require('fs');
  var session = require('electron').remote.session;
  var ses = session.fromPartition('persist:name');

  var storeUrl = "";
  var storePassword = "";
  var themeId = "";

  function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

  function setHistory(url, pw){
    var history = "";
    var currentList = $("#history-list").find("option");
    var added = false;
    url = url.trim();
    for(var i =0; i< currentList.length; i++) {
      var historyObj = currentList[i].value;
      if(i == 0) {
        history = historyObj;
      } else {
        if(historyObj.indexOf(url) == 0) {
          history += ("," + url + "/" + pw);
          added = true;
        } else {
          history += ("," + historyObj);
        }
      }
    }
    if(added == false) {
      history += ("," + url + "/" + pw);
    }

    var expiration = new Date();
    var hour = expiration.getHours();
    hour = hour + 90000;
    expiration.setHours(hour);
    ses.cookies.set({
        url: "localmachine", //the url of the cookie.
        name: "history", // a name to identify it.
        value: history, // the value that you want to save
        expirationDate: expiration.getTime()
    }, function(error) {
        /*console.log(error);*/
    });

    getHistory();
  }

  function getHistory(){
      var obj = {
          "name": "history"
      };

      ses.cookies.get(obj, function(error, cookies) {
          if(cookies[0].value.trim().length > 0) {
            var historyList = cookies[0].value.split(",");
            $('#history-list')[0].options.length = 0;
            for(var i = 0; i < historyList.length; i++) {
              var historyObj = historyList[i].split("/");
              var url = historyObj[0];
              var pw = historyObj[1];
              $('#history-list').append('<option value="'+historyList[i]+'">'+url+'</option>');
            }
          }
      });
  }

  $('#store-url').bind('input propertychange focus', function() {
    storeUrl = this.value;
  });

  $('#store-password').bind('input propertychange focus', function() {
    storePassword = this.value;
  });

  $('#theme-list').bind('input propertychange focus', function() {
    themeId = this.value;
  });

  $('#history-list').bind('input propertychange focus', function() {
    var historyObj = this.value.split("/");
    $("#store-url").val(historyObj[0]);
    storeUrl = historyObj[0];
    $("#store-password").val(historyObj[1]);
    storePassword = historyObj[1];
  });

  getHistory();

  $('#submit').on('click', (e, bounds) => {
    $('.theme-row').show();

    if (!fs.existsSync("themes")){
      fs.mkdirSync("themes");
    }

    var execList = "theme get --list -s=\"" + storeUrl +"\" -p=" + storePassword;
    exec(execList, (err, stdout, stderr) => {

      if (err) {
        // node couldn't execute the command
        window.alert(err);
        return;
      }

      $('#theme-list')[0].options.length = 0;

      var themeList = stdout.split("\n");
      for(var i = 1; i < themeList.length; i++) {
        var themeRow = themeList[i].trim();
        if(themeRow.length > 0) {
          var idx = themeRow.indexOf("]");
          var themeIdR = themeRow.substring(1,idx).trim();
          var themeName = themeRow.substring(idx+2).trim();
          if(themeRow.indexOf("[live]") > 0) {
            themeIdR = themeRow.substring(1,idx).trim();
            themeName = themeRow.substring(idx+1).trim();
          }

          $('#theme-list').append('<option value="'+themeIdR+'">'+themeName+' ('+themeIdR+')</option>');
          if(i == 1) {
            themeId = themeIdR;
          }
        }
      }

      setHistory(storeUrl, storePassword);

      $("#download").show()
    });
  });

  $('#download').on('click', (e, bounds) => {
    $("#statusCode").html("");

    const dir = "themes/" + storeUrl;
    try {
      if(fs.existsSync(dir)) {
        deleteFolderRecursive(dir);
      }
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
    } catch (err) {
      window.alert(err);
    }

    var execGet = "theme get -s=\"" + storeUrl +"\" -p=" + storePassword +" -t=" + themeId + " -d=\"" + dir +"\" -c=\""+dir+"/config.yml\""
    var proc = exec(execGet);
    proc.stdout.on('data', function(data) {
        if(data.indexOf("[2K") > 0) {
          data = data.substring(data.indexOf("[2K")+4);
        }
        $("#statusProgress").html("<b>[PROGRESS]</b> " + data);
    });
    proc.stderr.on('data', function(data) {
        $("#statusError").html("<b>[ERROR]</b> " + data);
    });
    proc.on('close', function(code) {
        if(code == 0) {
          code = "Done -- Code can be found in: " + dir;
        }
        $("#statusCode").html("<b>[EXIT_CODE]</b> " + code);
    });
  });

  $('#store-password').focus() // focus input box
  $('#store-url').focus() // focus input box
});
