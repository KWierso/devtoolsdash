let searchString = "https://bugzilla.mozilla.org/rest/bug" +
  "?product=Firefox" +
  "&component=Developer%20Tools" +
  "&component=Developer%20Tools:%203D%20View" +
  "&component=Developer%20Tools:%20App%20Manager" +
  "&component=Developer%20Tools:%20Console" +
  "&component=Developer%20Tools:%20Debugger"+
  "&component=Developer%20Tools:%20Framework" +
  "&component=Developer%20Tools:%20Graphic%20Commandline%20and%20Toolbar" +
  "&component=Developer%20Tools:%20Inspector" +
  "&component=Developer%20Tools%20Netmonitor" +
  "&component=Developer%20Tools%20Object%20Inspector" +
  "&component=Developer%20Tools:%20Profiler" +
  "&component=Developer%20Tools:%20Responsive%20Mode" +
  "&component=Developer%20Tools:%20Scratchpad" +
  "&component=Developer%20Tools:%20Source%20Editor" +
  "&component=Developer%20Tools:%20Style%20Editor" +
  "&resolution=" +
  "&include_fields=id,summary,component,priority," +
          "whiteboard,assigned_to,severity";

  let request = require("sdk/request").Request;
  let tabs = require("sdk/tabs");
  let data = require("sdk/self").data;
  let worker;

  tabs.open({
    url: data.url("devtooldash.html"),
    onReady: function onReady(tab) {
      worker = tab.attach({
        contentScriptFile: data.url("devtooldash.js")
      });
    }
  });

  request({
    url: searchString,
    headers: {"Accept": "application/json", "Content-Type": "application/json"},
    onComplete: function (response) {
      worker.port.emit("bugs", response.json);
    }
  }).get();

  request({
    url: "https://api-dev.bugzilla.mozilla.org/latest/count?product=Firefox&resolution=---&x_axis_field=component",
    headers: {"Accept": "application/json", "Content-Type": "application/json"},
    onComplete: function (response) {
      worker.port.emit("componentCount", response.json);
    }
  }).get();
  
  
  