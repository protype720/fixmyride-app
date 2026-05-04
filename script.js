let currentProblem = "";
let step = 0;
let answers = [];

const vehicleData = {
  "2006-ford-f250-6.0": {
    name: "2006 Ford F-250 6.0 Powerstroke",
    fuseBoxes: ["Under-hood power distribution box", "Interior fuse panel under dash"],
    commonFuses: ["PCM power fuse", "FICM power fuse", "Fuel pump fuse/relay", "Starter relay", "Ignition switch fuse", "Cluster fuse"],
    commonProblems: ["Cranks but no start", "Low ICP pressure", "FICM voltage issues", "Cam/crank sync problems", "Fuel delivery issues"]
  },
  "2005-jeep-liberty": {
    name: "2005 Jeep Liberty",
    fuseBoxes: ["Power distribution center under hood", "Interior fuse panel"],
    commonFuses: ["Ignition fuse", "Starter relay", "Fuel pump relay", "Brake light fuse", "PCM fuse"],
    commonProblems: ["No crank", "Brake light issues", "Dash electrical issues", "Fuel pump problems"]
  },
  "2000-chevy-blazer": {
    name: "2000 Chevy Blazer",
    fuseBoxes: ["Under-hood fuse block", "Interior fuse panel"],
    commonFuses: ["ECM fuse", "Fuel pump relay", "Starter relay", "Brake light fuse", "IGN fuse"],
    commonProblems: ["No start", "Fuel pump failure", "Brake light problems", "Ignition switch issues"]
  }
};

const problems = {
  wontStart: {
    title: "🚗 Won’t Start",
    questions: [
      "Does the engine crank?",
      "Do the dash lights come on?",
      "Do you hear clicking?",
      "Does it try to start with starting fluid?",
      "Is the security light flashing or staying on?"
    ]
  },
  overheating: {
    title: "🔥 Overheating",
    questions: [
      "Is coolant low?",
      "Do you see leaks?",
      "Do radiator fans turn on?",
      "Does the heater blow hot?",
      "Is steam coming from engine bay?"
    ]
  },
  battery: {
    title: "🔋 Battery / Charging",
    questions: [
      "Does it need jumped often?",
      "Are terminals dirty or loose?",
      "Is voltage below 12.2V off?",
      "Is voltage below 13.5V running?",
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

const codes = {
  P0300: "Random/multiple cylinder misfire. Check plugs, coils, fuel pressure, vacuum leaks, and compression.",
  P0301: "Cylinder 1 misfire. Check plug, coil, injector, compression, and wiring.",
  P0302: "Cylinder 2 misfire. Check plug, coil, injector, compression, and wiring.",
  P0303: "Cylinder 3 misfire. Check plug, coil, injector, compression, and wiring.",
  P0304: "Cylinder 4 misfire. Check plug, coil, injector, compression, and wiring.",
  P0171: "Lean condition bank 1. Check vacuum leaks, intake leaks, MAF, fuel pressure.",
  P0174: "Lean condition bank 2. Check vacuum leaks, intake leaks, MAF, fuel pressure.",
  P0420: "Catalyst efficiency low bank 1. Check catalytic converter, O2 sensor, exhaust leak.",
  P0430: "Catalyst efficiency low bank 2. Check catalytic converter, O2 sensor, exhaust leak.",
  P0335: "Crankshaft position sensor circuit fault. Check crank sensor, wiring, connector.",
  P0340: "Camshaft position sensor circuit fault. Check cam sensor, wiring, connector.",
  P2285: "ICP sensor circuit low. Check ICP sensor, wiring, connector, and 5V reference.",
  P2290: "Injector control pressure too low. Check oil level, ICP, IPR, HPOP, leaks.",
  P2291: "Injector control pressure too low while cranking. Check oil level, ICP/IPR, HPOP, cranking speed.",
  B1352: "Ford ignition key-in circuit fault. Check ignition switch, cluster, fuses, and wiring.",
  U0100: "Lost communication with PCM/ECM. Check power, grounds, fuses, battery voltage, CAN wiring.",
  U1900: "CAN bus communication fault. Check modules, grounds, wiring, low voltage."
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
  const year = document.getElementById("yearInput").value.toLowerCase().trim();
  const make = document.getElementById("makeInput").value.toLowerCase().trim();
  const model = document.getElementById("modelInput").value.toLowerCase().replace(/\s+/g, "").trim();
  const engine = document.getElementById("engineInput").value.toLowerCase().trim();

  let key = `${year}-${make}-${model}`;
  if (year === "2006" && make === "ford" && model.includes("f250") && engine.includes("6.0")) {
    key = "2006-ford-f250-6.0";
  }

  const data = vehicleData[key];
  const box = document.getElementById("vehicleResult");

  if (!data) {
    box.innerHTML = `
      <div class="card">
        <h3>Vehicle not added yet</h3>
        <p>This app is built for 1990+ vehicles, but this vehicle’s detailed data has not been added yet.</p>
        <p>Use Fuse Finder, Code Lookup, or Assistant for general help.</p>
      </div>
    `;
    return;
  }

  box.innerHTML = `
    <div class="card">
      <h3>${data.name}</h3>
      <h4>Fuse Box Locations</h4>
      <ul>${data.fuseBoxes.map(item => `<li>${item}</li>`).join("")}</ul>
      <h4>Common Fuses / Relays</h4>
      <ul>${data.commonFuses.map(item => `<li>${item}</li>`).join("")}</ul>
      <h4>Common Problems</h4>
      <ul>${data.commonProblems.map(item => `<li>${item}</li>`).join("")}</ul>
    </div>
  `;
}

function showFuseFinder() {
  hideHome();
  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>⚡ Fuse Finder</h2>
      <button onclick="fuseHelp('nostart')">No Start / No Crank</button>
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
    nostart: ["Starter relay", "Ignition fuse", "PCM/ECM fuse", "Neutral safety circuit", "Main power fuse"],
    fuel: ["Fuel pump fuse", "Fuel pump relay", "PCM power fuse", "Injector fuse", "Fuel shutoff circuit"],
    lights: ["Brake light fuse", "Stop lamp switch fuse", "Tail lamp fuse", "Trailer wiring fuse", "Rear light grounds"],
    cluster: ["Cluster fuse", "Ignition switch fuse", "Body control module fuse", "PCM communication fuse", "Grounds"],
    charging: ["Alternator fuse", "Fusible link", "Battery junction fuse", "Main power fuse", "Ground straps"]
  };

  document.getElementById("fuseResult").innerHTML = `
    <div class="card">
      <h3>Check these first:</h3>
      <ul>${help[type].map(item => `<li>${item}</li>`).join("")}</ul>
      <p><b>Tip:</b> Fuse names change by vehicle, so confirm with the fuse box cover or owner’s manual.</p>
    </div>
  `;
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
    if (answers[1] === "no") result = "Most likely battery, cable, ground, or main fuse issue.";
    else if (answers[0] === "no" && answers[2] === "yes") result = "Most likely weak battery, starter, relay, or cable issue.";
    else if (answers[0] === "yes" && answers[3] === "yes") result = "Most likely fuel delivery issue.";
    else if (answers[4] === "yes") result = "Possible security, key, ignition, or module communication issue.";
    else result = "Check battery, fuel pressure, spark/injector pulse, crank/cam signal, and codes.";
  }

  if (currentProblem === "overheating") result = "Check coolant level, leaks, fans, thermostat, water pump, and radiator flow.";
  if (currentProblem === "battery") result = "Check battery voltage, terminals, alternator output, fuses, and grounds.";
  if (currentProblem === "brakeLights") result = "Check bulbs, fuse, brake switch power in/out, grounds, and trailer wiring.";

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>Diagnosis</h2>
      <p>${result}</p>
      <button onclick="showHome()">Start Over</button>
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

  if (codes[input]) {
    result.innerHTML = `<div class="card"><p><b>${input}</b>: ${codes[input]}</p></div>`;
    return;
  }

  if (input.startsWith("P")) result.innerHTML = `<div class="card"><p><b>${input}</b>: Powertrain code. Engine, fuel, ignition, emissions, or transmission related.</p></div>`;
  else if (input.startsWith("B")) result.innerHTML = `<div class="card"><p><b>${input}</b>: Body system code. Lights, ignition, cluster, security, doors, or BCM related.</p></div>`;
  else if (input.startsWith("C")) result.innerHTML = `<div class="card"><p><b>${input}</b>: Chassis code. ABS, steering, brakes, suspension, or traction control related.</p></div>`;
  else if (input.startsWith("U")) result.innerHTML = `<div class="card"><p><b>${input}</b>: Communication code. Check battery voltage, grounds, fuses, modules, and CAN wiring.</p></div>`;
  else result.innerHTML = `<div class="card"><p>Code not recognized.</p></div>`;
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

  if (input.includes("fuse")) answer.innerHTML = `<div class="card"><p>Use Fuse Finder. Start with system fuse, relay, related module fuse, and grounds.</p></div>`;
  else if (input.includes("start") || input.includes("crank") || input.includes("click")) answer.innerHTML = `<div class="card"><p>Check battery voltage, starter signal, ignition switch, fuel pressure, spark/injector pulse, crank/cam signal, and codes.</p></div>`;
  else if (input.includes("overheat") || input.includes("hot")) answer.innerHTML = `<div class="card"><p>Do not keep driving hot. Check coolant, leaks, fans, thermostat, water pump, and radiator flow.</p></div>`;
  else if (input.includes("battery") || input.includes("alternator")) answer.innerHTML = `<div class="card"><p>Check 12.6V engine off and 13.5V–14.7V running. Inspect terminals, grounds, belt, and alternator fuse.</p></div>`;
  else answer.innerHTML = `<div class="card"><p>Try asking about no start, overheating, battery, fuse, brake lights, or a code.</p></div>`;
}
