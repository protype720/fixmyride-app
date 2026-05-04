function showVehicleLookup() {
  document.getElementById("home").style.display = "none";

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>Vehicle Lookup</h2>
      <input id="year" placeholder="Year">
      <input id="make" placeholder="Make">
      <input id="model" placeholder="Model">
      <button onclick="lookupVehicle()">Search</button>
      <div id="result"></div>
      <button onclick="goHome()">Back</button>
    </div>
  `;
}

function lookupVehicle() {
  const year = document.getElementById("year").value;
  const make = document.getElementById("make").value.toLowerCase();
  const model = document.getElementById("model").value.toLowerCase();

  let output = "No data yet";

  if (year == "2006" && make == "ford" && model.includes("f250")) {
    output = `
      <h3>2006 Ford F-250</h3>
      <p>Fuse boxes:</p>
      <ul>
        <li>Under hood</li>
        <li>Under dash</li>
      </ul>
      <p>Check:</p>
      <ul>
        <li>PCM fuse</li>
        <li>Fuel pump fuse</li>
        <li>Starter relay</li>
      </ul>
    `;
  }

  document.getElementById("result").innerHTML = output;
}

function showFuseFinder() {
  document.getElementById("home").style.display = "none";

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>Fuse Finder</h2>
      <button onclick="fuseHelp('start')">No Start</button>
      <button onclick="fuseHelp('fuel')">Fuel</button>
      <button onclick="fuseHelp('lights')">Lights</button>
      <div id="fuseResult"></div>
      <button onclick="goHome()">Back</button>
    </div>
  `;
}

function fuseHelp(type) {
  let text = "";

  if (type == "start") {
    text = "Check starter relay, ignition fuse, PCM fuse";
  }
  if (type == "fuel") {
    text = "Check fuel pump fuse and relay";
  }
  if (type == "lights") {
    text = "Check brake fuse and light switch";
  }

  document.getElementById("fuseResult").innerHTML = `<p>${text}</p>`;
}

function showAssistant() {
  document.getElementById("home").style.display = "none";

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>Assistant</h2>
      <input id="input" placeholder="Type issue">
      <button onclick="ask()">Ask</button>
      <div id="answer"></div>
      <button onclick="goHome()">Back</button>
    </div>
  `;
}

function ask() {
  const input = document.getElementById("input").value.toLowerCase();

  let answer = "Try describing more";

  if (input.includes("start")) answer = "Check battery, starter, fuel";
  if (input.includes("overheat")) answer = "Check coolant and fans";

  document.getElementById("answer").innerHTML = answer;
}

function goHome() {
  document.getElementById("home").style.display = "grid";
  document.getElementById("screen").innerHTML = "";
}
