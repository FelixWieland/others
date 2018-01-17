$("#fw-add-server").click(function () {
  $("#fw-add-container").toggle();
  if($("#fw-add-container").css("display") == "block"){
    $(".fw-left-top-addbtn").html('x');
  }
  else {
    $(".fw-left-top-addbtn").html('+');
  }
});

$("#fw-add-server-container-div-addbtn").click(function () {
  //read values from input

  if(!$("#fw-add-input-servername").val() || !$("#fw-add-input-ip").val() || !$("#fw-add-input-low").val() || !$("#fw-add-input-medium").val() || !$("#fw-add-input-high").val()) {
    $("#fw-msg-box-msg").html("Nicht jedes Feld ist befüllt!");
    $("#fw-msg-box-ico").toggleClass("glyphicon-alert");
    $("#fw-msg-box-ico").css("color", "#fdd835");
    $("#fw-msg-box").show().delay(2000).fadeOut("slow", function () {
      $("#fw-msg-box-ico").toggleClass("glyphicon-alert");
    });
    return null;
  }

  var servername = $("#fw-add-input-servername").val();
  var ip = $("#fw-add-input-ip").val();
  var low = $("#fw-add-input-low").val();
  var medium = $("#fw-add-input-medium").val();
  var high = $("#fw-add-input-high").val();

  $.post("/cgi-bin/serveradddelshow.cgi", {"choose": "add", "servername": servername, "ip": ip, "low": low, "medium": medium, "high": high}, function(data) {
    if(data.includes("successful")){

      pattern = '<div id="musterservername" class="fw-server"><div class="fw-server-reachability" style="background-color: mustercolor;"><p class="fw-server-pingtime">musterpingtime ms</p></div><div class="fw-server-data"><p class="fw-server-name">musterservername</p></div></div>';

      var filledpattern = pattern;

      var filledpattern = filledpattern.replace("musterservername", servername);
      var filledpattern = filledpattern.replace("musterservername", servername);
      var filledpattern = filledpattern.replace("musterip", ip);
      var filledpattern = filledpattern.replace("musterpingtime", "-");
      var filledpattern = filledpattern.replace("mustercolor", "rgb(230, 230, 230)");

      $('#fw-server-dashboard').append(filledpattern);

      pattern = '<div class="fw-server-display-existant" id="show-musterservername"><p>musterservername</p><span name="musterservername" class="glyphicon glyphicon-trash fw-server-display-existant-span" aria-hidden="true"></span></div>';
      var filledpattern = pattern;
      for (var i = 0; i < 3; i++) {
        var filledpattern = filledpattern.replace("musterservername", servername);
      }
      $('#fw-existent-servers').append(filledpattern);

      $("#fw-add-input-servername").val("");
      $("#fw-add-input-ip").val("");

      $("#fw-msg-box-msg").html("Server wurde hinzugefügt");
      $("#fw-msg-box-ico").toggleClass("glyphicon-ok");
      $("#fw-msg-box-ico").css("color", "#43a047");
      $("#fw-msg-box").show().delay(1000).fadeOut("slow", function () {
        $("#fw-msg-box-ico").toggleClass("glyphicon-ok");
      });
    }
    else {
      console.log(data);
    }
  });

});

$(document).on("click", ".fw-server-display-existant-span", function() {
  servername = $(this).attr("name");
  idselector = '#show-' + servername;
  $.post("/cgi-bin/serveradddelshow.cgi", {"choose": "delete", "servername": servername}, function(data) {
    if(data.includes("successful")){
      $(idselector).remove();
      $("#" + servername).remove();
      $("#fw-msg-box-msg").html("Server wurde entfernt");
      $("#fw-msg-box-ico").toggleClass("glyphicon-trash");
      $("#fw-msg-box-ico").css("color", "#c62828");
      $("#fw-msg-box").show().delay(1000).fadeOut("slow", function () {
        $("#fw-msg-box-ico").toggleClass("glyphicon-trash");
      });
    }
    else {
      console.log(data);
    }
  });
});

$(document).ready(function () {
  $.post("/cgi-bin/serveradddelshow.cgi", {"choose": "show"}, function(data) {
    json = JSON.parse(data);
    displayServers(json);
  });
});

function displayServers(json) {

  pattern = '<div class="fw-server-display-existant" id="show-musterservername"><p>musterservername</p><span name="musterservername" class="glyphicon glyphicon-trash fw-server-display-existant-span" aria-hidden="true"></span></div>';

  for (var server in json) {
    var name = server; //NAME

    var filledpattern = pattern;
    for (var i = 0; i < 3; i++) {
      var filledpattern = filledpattern.replace("musterservername", name);
    }

    $('#fw-existent-servers').append(filledpattern);
  }
}
