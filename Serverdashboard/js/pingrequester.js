var BUILDED_DASH = false;


$(document).ready(function() {
  pingRequest();
});

setInterval(function(){
  pingRequest();
}, 10000);

function pingRequest() {
  $.post("/cgi-bin/pinghandler.cgi", {}, function(data) {
    BUILDED_DASH = validateJSON(data);
  });
}

function validateJSON(json) {
  var json = JSON.parse(json);

  if(BUILDED_DASH == false){
    return buildDash(json);
  }

    for (var server in json) {
      var name = server; //NAME
      var ip = json[server].ip; //IP
      var ping = json[server].pingtime ;//PING
      var cval = json[server].hmlvalue; //CVAL - COLORVALUE
      updateDash(name, ip, ping, cval);
    }

  //HOLD BUILDED_DASH
  return true;
}

function updateDash(name, ip, ping, cval) {
  var selector = '#' + name;
  var color = getColor(cval);

  time = ' ms';
  if(ping == 'offline'){
    time = '  ';
  }

  $(selector).find('.fw-server-reachability').css('background-color', color);
  $(selector).find('.fw-server-pingtime').html(ping + time);
}

function buildDash(json) {
  pattern = '<div id="musterservername" class="fw-server"><div class="fw-server-reachability" style="background-color: mustercolor;"><p class="fw-server-pingtime">musterpingtime ms</p></div><div class="fw-server-data"><p class="fw-server-name">musterservername</p></div></div>';

  console.log(json);
  $('#fw-server-dashboard').html("");
  for (var server in json) {
    var name = server; //NAME
    var ip = json[server].ip; //IP
    var ping = json[server].pingtime ;//PING
    var cval = json[server].hmlvalue; //CVAL - COLORVALUE

    var color = getColor(cval);

    var filledpattern = pattern;
    //Befülle das Pattern
    var filledpattern = filledpattern.replace("musterservername", name);
    var filledpattern = filledpattern.replace("musterservername", name);
    var filledpattern = filledpattern.replace("musterip", ip);
    var filledpattern = filledpattern.replace("musterpingtime", ping);
    var filledpattern = filledpattern.replace("mustercolor", color);

    if(ping == 'offline'){
      var filledpattern = filledpattern.replace("ms", " ");
    }

    $('#fw-server-dashboard').append(filledpattern);
  }
  return true;
}

function getColor(cval){
  var color = null;
  switch (cval) {
    case "HIGH":
      color = "#c62828";
      break;
    case "MEDIUM":
      color = "#fdd835";
      break;
    case "LOW":
      color = "#43a047";
      break
    case "OFFLINE":
      color = "#9e9e9e";
      break;
    default:
  }
  return color;
}
