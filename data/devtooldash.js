let bugsDiv = document.getElementById("bugs");
let countselect = document.getElementById("countselect");
let assignedselect = document.getElementById("assignedselect");

let fetchingheader = document.getElementById("fetchingheader");
let bugdetails = document.getElementById("bugdetails");

assignedselect.addEventListener("change", function(evt) {
  let selectedIndex = assignedselect.selectedIndex;
  if(selectedIndex == 0) {
    for(let bug of bugdetails.children) {
      bug.setAttribute("assignedhidden", "false");
    }
  }
  if(selectedIndex == 1) {
    for(let bug of bugdetails.children) {
      if(bug.getAttribute("assignee") == "nobody@mozilla.org" || bug.getAttribute("assignee") == "Assignee") {
        bug.setAttribute("assignedhidden", "false");
      } else {
        bug.setAttribute("assignedhidden", "true");
      }
    }
  }
  if(selectedIndex == 2) {
    for(let bug of bugdetails.children) {
      if(bug.getAttribute("assignee") != "nobody@mozilla.org") {
        bug.setAttribute("assignedhidden", "false");
      } else {
        bug.setAttribute("assignedhidden", "true");
      }
    }
  }
}, false);

countselect.addEventListener("change", function(evt) {
  let selectedOption = countselect.options[countselect.selectedIndex].getAttribute("component");
  if(selectedOption == null) {
    for(let bug of bugdetails.children) {
      bug.setAttribute("selectedcomponent", "true");
    }
    return;
  }

  for(let bug of bugdetails.children) {
    if(bug.getAttribute("component") != selectedOption && bug.getAttribute("component") != "Component") {
      bug.setAttribute("selectedcomponent", "false");
    } else {
      bug.setAttribute("selectedcomponent", "true");
    }
  }
}, false);

self.port.on("componentCount", function(json) {
  let counts = document.getElementById("counts");
  let total = 0;

  for(let i in json.data) {
    if(json.x_labels[i].search("Developer Tools") > -1)
      total = total + json.data[i];
  }

  countselect.getElementsByTagName("option")[0].textContent = "TOTAL BUGS (" + total + ")";


  for(let i in json.x_labels) {
    if(json.x_labels[i].search("Developer Tools") > -1) {
      let component = document.createElement("option");
      component.textContent = json.x_labels[i].replace("Graphic Commandline", "GCLI") + " (" + json.data[i] + ")";
      component.textContent = component.textContent.replace("Developer Tools: ", "");

      countselect.appendChild(component);
      component.setAttribute("component", json.x_labels[i]);
    }
  }
});

self.port.on("bugs", function(json) {
  let header = {
    "priority":"Priority",
    "component":"Component",
    "summary":"Summary",
    "assigned_to":"Assignee",
    "whiteboard":"Whiteboard",
    "id":"ID",
    "severity":"Severity"
  }
  addBugDiv(header);

  let bugs = json["bugs"];
  for(let bug of bugs) {
    addBugDiv(bug);
  }
  fetchingheader.setAttribute("class", "hidden");
  countselect.removeAttribute("disabled");
  assignedselect.removeAttribute("disabled");
  bugdetails.removeAttribute("class");
});

// Create a div containing each attribute from the bug
// Push the bug div into the array of all bugs
function addBugDiv(bug) {
  let thisBug = document.createElement("div");

  createAttributeElements("ID", bug.id, thisBug);
  createAttributeElements("Summary", bug.summary, thisBug);
  createAttributeElements("Component", bug.component, thisBug);
  createAttributeElements("Priority", bug.priority, thisBug);
  createAttributeElements("Severity", bug.severity, thisBug);
  createAttributeElements("Assignee", bug.assigned_to, thisBug);
  createAttributeElements("Whiteboard", bug.whiteboard, thisBug);

  bugdetails.appendChild(thisBug);
}

// Create a div with a label and the bug's value for a given attribute
// Append the attribute to the current bug
function createAttributeElements(label, value, bug) {
  let valueDiv = document.createElement("div");

  
  if(label == "ID") {
    let link = document.createElement("a");
    link.href = "https://bugzil.la/" + value;
    link.textContent = value;
    valueDiv.appendChild(link);
  } else {
    valueDiv.textContent = value;
  }
  if(label == "Component") {
    valueDiv.textContent = valueDiv.textContent.replace("Developer Tools: ", "");
    valueDiv.textContent = valueDiv.textContent.replace("Graphic Commandline", "GCLI");
  }
  if(label == "Severity") {
    valueDiv.textContent = valueDiv.textContent.replace("enhancement", "enhance");
  }
  if(label == "Assignee") {
    valueDiv.textContent = valueDiv.textContent.replace("nobody@mozilla.org", "");
  }

  bug.setAttribute(label, value);

  bug.appendChild(valueDiv);
}



