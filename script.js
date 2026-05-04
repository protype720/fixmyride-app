let currentProblem = "";
let step = 0;
let answers = [];

const problems = {
  wontStart: {
    title: "🚗 Won’t Start",
    questions: [
      "Does the engine crank?",
      "Do dash lights come on?",
      "Do you hear clicking?",
      "Does it try to start with starting fluid?",
      "Is the security light on?"
    ]
  },
  overheating: {
    title: "🔥 Overheating",
    questions: [
      "Is coolant low?",
      "Do you see leaks?",
      "Do fans turn on?",
      "Does heater blow hot?",
      "Is steam coming out?"
    ]
  },
  battery: {
    title: "🔋 Battery / Charging",
    questions: [
      "Does it need jumped often?",
      "Are terminals dirty?",
      "Is battery under 12.2V?",
      "Is running voltage under 13.5V?",
      "Is battery light on?"
    ]
  },
  brakeLights: {
    title: "💡 Brake Lights",
    questions: [
      "Do any brake lights work?",
      "Are fuses good?",
      "Do tail lights work?",
      "Does brake switch have power?",
      "Has trailer wiring been messed with?"
    ]
  }
};

function hideHome() {
  document.getElementById("home").style.display = "none";
}

function showHome() {
  document.getElementById("home").style.display = "grid";
  document.getElementById("screen").innerHTML = "";
  currentProblem = "";
  step = 0;
  answers = [];
}

function startProblem(problem) {
  currentProblem = problem;
  step = 0;
  answers = [];
  hideHome();
  askQuestion();
}

function askQuestion() {
  const p = problems[currentProblem];

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>${p.title}</h2>
      <p>Question ${step + 1} of ${p.questions.length}</p>
      <h3>${p.questions[step]}</h3>
      <button onclick="answer('yes')">Yes</button>
      <button onclick="answer('no')">No</button>
      <button onclick="answer('not sure')">Not Sure</button>
      <button onclick="showHome()">Back</button>
    </div>
  `;
}

function answer(response) {
  answers.push(response);
  step++;

  if (step >= problems[currentProblem].questions.length) {
    diagnose();
  } else {
    askQuestion();
  }
}

function diagnose() {
  let result = "";

  if (currentProblem === "wontStart") {
    if (answers[1] === "no") result = "Most likely dead battery, bad cable, bad ground, or main fuse.";
    else if (answers[0] === "no" && answers[2] === "yes") result = "Most likely weak battery, starter, starter relay, or cable issue.";
    else if (answers[0] === "yes" && answers[3] === "yes") result = "Most likely fuel delivery issue.";
    else result = "Check battery, fuel pressure, spark/injector pulse, crank/cam signal, and codes.";
  }

  if (currentProblem === "overheating") {
    result = "Check coolant level, leaks, radiator fans, thermostat, water pump, and radiator flow.";
  }

  if (currentProblem === "battery") {
    result = "Check battery voltage, terminals, alternator output, fuses, belt, and grounds.";
  }

  if (currentProblem === "brakeLights") {
    result = "Check bulbs, fuse, brake switch power in/out, rear grounds, and trailer wiring.";
  }

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>Diagnosis</h2>
      <p>${result}</p>
      <button onclick="showHome()">Start Over</button>
    </div>
  `;
}

function showVehicleLookup() {
  hideHome();

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>🚘 Vehicle Lookup</h2>
      <input id="yearInput" placeholder="Year ex: 2006">
      <input id="makeInput" placeholder="Make ex: Ford">
      <input id="modelInput" placeholder="Model ex: F250">
      <input id="engineInput" placeholder="Engine ex: 6.0">
      <button onclick="lookupVehicle()">Search Vehicle</button>
      <div id="vehicleResult"></div>
      <button onclick="showHome()">Back</button>
    </div>
  `;
}

function lookupVehicle() {
  const year = document.getElementById("yearInput").value.trim();
  const make = document.getElementById("makeInput").value.trim();
  const model = document.getElementById("modelInput").value.trim();
  const engine = document.getElementById("engineInput").value.trim();

  let special = "";

  if (year === "2006" && make.toLowerCase().includes("ford") && model.toLowerCase().includes("f250")) {
    special = `
      <h4>Known 6.0 Powerstroke Checks</h4>
      <ul>
        <li>FICM power fuse</li>
        <li>PCM power fuse</li>
        <li>Fuel pump fuse/relay</li>
        <li>Starter relay</li>
        <li>ICP/IPR system</li>
        <li>Cam/crank sync</li>
      </ul>
    `;
  }

  document.getElementById("vehicleResult").innerHTML = `
    <div class="card">
      <h3>${year} ${make} ${model} ${engine}</h3>
      <p><b>General fuse box locations:</b></p>
      <ul>
        <li>Under hood near battery</li>
        <li>Driver side under dash</li>
        <li>Passenger kick panel or glove box area on some vehicles</li>
      </ul>
      <p><b>Common fuses/relays to check:</b></p>
      <ul>
        <li>ECM/PCM fuse</li>
        <li>IGN fuse</li>
        <li>Starter relay</li>
        <li>Fuel pump relay</li>
        <li>Brake light fuse</li>
      </ul>
      ${special}
      <p><b>Note:</b> Verify exact fuse locations with the owner’s manual or fuse box cover.</p>
    </div>
  `;
}

function showFuseFinder() {
  hideHome();

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>⚡ Fuse Finder</h2>
      <button onclick="fuseHelp('start')">No Start / No Crank</button>
      <button onclick="fuseHelp('fuel')">Fuel Pump / Fuel Issue</button>
      <button onclick="fuseHelp('lights')">Lights / Brake Lights</button>
      <button onclick="fuseHelp('cluster')">Dash / Cluster / Ignition</button>
      <button onclick="fuseHelp('charging')">Battery / Charging</button>
      <div id="fuseResult"></div>
      <button onclick="showHome()">Back</button>
    </div>
  `;
}

function fuseHelp(type) {
  const help = {
    start: ["Starter relay", "Ignition fuse", "PCM/ECM fuse", "Neutral safety switch circuit", "Main power fuse"],
    fuel: ["Fuel pump fuse", "Fuel pump relay", "PCM power fuse", "Injector fuse", "Fuel shutoff circuit"],
    lights: ["Brake light fuse", "Stop lamp switch fuse", "Tail lamp fuse", "Trailer wiring fuse", "Rear grounds"],
    cluster: ["Cluster fuse", "Ignition switch fuse", "Body control module fuse", "PCM communication fuse", "Grounds"],
    charging: ["Alternator fuse", "Fusible link", "Battery junction fuse", "Main power fuse", "Ground straps"]
  };

  document.getElementById("fuseResult").innerHTML = `
    <div class="card">
      <h3>Check these first:</h3>
      <ul>${help[type].map(item => `<li>${item}</li>`).join("")}</ul>
      <p><b>Tip:</b> Fuse names change by vehicle. Verify with fuse box cover or owner’s manual.</p>
    </div>
  `;
}

function showCodeLookup() {
  hideHome();

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>📟 Code Lookup</h2>
      <input id="codeInput" placeholder="Enter code ex: P0300">
      <button onclick="lookupCode()">Search</button>
      <div id="codeResult"></div>
      <button onclick="showHome()">Back</button>
    </div>
  `;
}

function lookupCode() {
  const input = document.getElementById("codeInput").value.toUpperCase().trim();
  const result = document.getElementById("codeResult");

  if (input === "") {
    result.innerHTML = `<div class="card"><p>Enter a code first.</p></div>`;
    return;
  }

  if (input === "P0300") {
    result.innerHTML = `<div class="card"><p><b>P0300:</b> Random misfire. Check spark plugs, coils, fuel pressure, vacuum leaks, and compression.</p></div>`;
  } else if (input === "B1352") {
    result.innerHTML = `<div class="card"><p><b>B1352:</b> Ford ignition key-in circuit fault. Check ignition switch, cluster, fuses, and wiring.</p></div>`;
  } else if (input === "U1900") {
    result.innerHTML = `<div class="card"><p><b>U1900:</b> CAN bus communication fault. Check battery voltage, grounds, modules, fuses, and wiring.</p></div>`;
  } else if (input.startsWith("P")) {
    result.innerHTML = `<div class="card"><p><b>${input}</b>: Powertrain code. Engine, fuel, ignition, emissions, or transmission related.</p></div>`;
  } else if (input.startsWith("B")) {
    result.innerHTML = `<div class="card"><p><b>${input}</b>: Body system code. Lights, ignition, cluster, security, doors, or body module related.</p></div>`;
  } else if (input.startsWith("C")) {
    result.innerHTML = `<div class="card"><p><b>${input}</b>: Chassis code. ABS, steering, brakes, suspension, or traction control related.</p></div>`;
  } else if (input.startsWith("U")) {
    result.innerHTML = `<div class="card"><p><b>${input}</b>: Communication code. Check battery voltage, grounds, fuses, modules, and CAN wiring.</p></div>`;
  } else {
    result.innerHTML = `<div class="card"><p>Enter a valid code like P0300, B1352, C0035, or U1900.</p></div>`;
  }
}

function showAssistant() {
  hideHome();

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>🤖 Mechanic Assistant</h2>
      <input id="chatInput" placeholder="Type your problem...">
      <button onclick="askAssistant()">Ask</button>
      <div id="chatAnswer"></div>
      <button onclick="showHome()">Back</button>
    </div>
  `;
}

function askAssistant() {
  const input = document.getElementById("chatInput").value.toLowerCase().trim();
  const answer = document.getElementById("chatAnswer");

  if (input === "") {
    answer.innerHTML = `<div class="card"><p>Type a problem first.</p></div>`;
    return;
  }

  if (input.includes("hi") || input.includes("hello") || input.includes("hey")) {
    answer.innerHTML = `<div class="card"><p>Hey 👋 Tell me what the vehicle is doing. Example: “cranks but won’t start” or “brake lights don’t work.”</p></div>`;
  } else if (input.includes("fuse")) {
    answer.innerHTML = `<div class="card"><p>Use Fuse Finder. Start with the system fuse, relay, related module fuse, and grounds.</p></div>`;
  } else if (input.includes("start") || input.includes("crank") || input.includes("click")) {
    answer.innerHTML = `<div class="card"><p>Check battery voltage, starter signal, ignition switch, fuel pressure, spark/injector pulse, crank/cam signal, and codes.</p></div>`;
  } else if (input.includes("overheat") || input.includes("hot")) {
    answer.innerHTML = `<div class="card"><p>Do not keep driving hot. Check coolant, leaks, fans, thermostat, water pump, and radiator flow.</p></div>`;
  } else if (input.includes("battery") || input.includes("alternator")) {
    answer.innerHTML = `<div class="card"><p>Check battery voltage: about 12.6V engine off and 13.5V–14.7V running. Inspect terminals, grounds, belt, and alternator fuse.</p></div>`;
  } else if (input.includes("brake")) {
    answer.innerHTML = `<div class="card"><p>Check brake light fuse, brake switch power in/out, bulbs, rear grounds, and trailer wiring.</p></div>`;
  } else {
    answer.innerHTML = `<div class="card"><p>I can help with that. Give me the year, make, model, and what it’s doing. Example: “2006 F250 cranks but won’t start.”</p></div>`;
  }
}
