let currentProblem = "";
let step = 0;
let answers = [];

const screen = () => document.getElementById("screen");
const home = () => document.getElementById("home");

const problems = {
  wontStart: {
    title: "🚗 Won’t Start",
    questions: [
      "Does the engine crank when you turn the key?",
      "Do the dash lights come on?",
      "Do you hear clicking from the starter area?",
      "Does it try to start with starting fluid?",
      "Is the security light flashing or staying on?"
    ]
  },
  overheating: {
    title: "🔥 Overheating",
    questions: [
      "Is the coolant low?",
      "Do you see coolant leaking?",
      "Do the radiator fans turn on?",
      "Does the heater blow hot air?",
      "Is steam coming from the engine bay?"
    ]
  },
  battery: {
    title: "🔋 Battery / Charging",
    questions: [
      "Does it need jumped often?",
      "Are the battery terminals dirty or loose?",
      "Is battery voltage under 12.2V with engine off?",
      "Is running voltage under 13.5V?",
      "Is the battery light on?"
    ]
  },
  brakeLights: {
    title: "💡 Brake Lights",
    questions: [
      "Do any brake lights work?",
      "Are the brake light fuses good?",
      "Do the tail lights work?",
      "Does the brake switch have power?",
      "Has trailer wiring been added or messed with?"
    ]
  }
};

function hideHome() {
  home().style.display = "none";
}

function showHome() {
  home().style.display = "grid";
  screen().innerHTML = "";
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

  screen().innerHTML = `
    <div class="card">
      <h2>${p.title}</h2>
      <p class="muted">Question ${step + 1} of ${p.questions.length}</p>
      <h3>${p.questions[step]}</h3>

      <div class="button-row">
        <button onclick="answer('yes')">Yes</button>
        <button onclick="answer('no')">No</button>
        <button onclick="answer('not sure')">Not Sure</button>
      </div>

      <button class="secondary" onclick="showHome()">⬅ Back</button>
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
  let checklist = [];

  if (currentProblem === "wontStart") {
    if (answers[1] === "no") {
      result = "Most likely a dead battery, loose battery cable, bad ground, blown main fuse, or ignition power issue.";
      checklist = ["Load test battery", "Clean/tighten terminals", "Check main fuses", "Check grounds", "Check ignition switch power"];
    } else if (answers[0] === "no" && answers[2] === "yes") {
      result = "Most likely weak battery, bad starter, starter relay issue, bad cable, or poor ground.";
      checklist = ["Check battery voltage while cranking", "Test starter relay", "Check starter signal wire", "Inspect battery cables", "Check engine ground strap"];
    } else if (answers[0] === "yes" && answers[3] === "yes") {
      result = "If it tries to run on starting fluid, the problem is likely fuel delivery, injector control, or sensor signal related.";
      checklist = ["Check fuel pressure", "Check fuel pump relay/fuse", "Check injector pulse", "Scan for codes", "Check crank/cam signal"];
    } else if (answers[4] === "yes") {
      result = "Security/anti-theft may be stopping fuel or injector operation.";
      checklist = ["Try spare key", "Check security light behavior", "Scan body/security codes", "Check ignition switch", "Check key transponder system"];
    } else {
      result = "A crank/no-start needs battery voltage, fuel, spark/injector pulse, compression, timing, and sensor sync checked.";
      checklist = ["Check codes", "Check RPM while cranking", "Check fuel pressure", "Check spark/injector pulse", "Check crank/cam sensors"];
    }
  }

  if (currentProblem === "overheating") {
    result = "Most overheating problems come from low coolant, leaks, bad thermostat, bad fans, clogged radiator, weak water pump, or air trapped in the system.";
    checklist = ["Do not keep driving hot", "Check coolant level cold", "Pressure test for leaks", "Verify fans turn on", "Check thermostat and radiator flow"];
  }

  if (currentProblem === "battery") {
    result = "Battery and charging problems usually come from weak battery, dirty terminals, bad alternator, loose belt, blown alternator fuse, or bad grounds.";
    checklist = ["Engine off: around 12.6V is healthy", "Running: 13.5V–14.7V is normal", "Clean terminals", "Check alternator fuse", "Check belt and grounds"];
  }

  if (currentProblem === "brakeLights") {
    result = "Brake light failures usually come from bad bulbs, blown fuse, bad brake switch, broken ground, trailer wiring short, or turn-signal/multifunction switch issue.";
    checklist = ["Check bulbs", "Check brake fuse", "Test brake switch power in/out", "Inspect trailer wiring", "Check rear grounds"];
  }

  screen().innerHTML = `
    <div class="card">
      <h2>🔎 Diagnosis Result</h2>
      <p>${result}</p>

      <h3>Check These First:</h3>
      <ul>
        ${checklist.map(item => `<li>${item}</li>`).join("")}
      </ul>

      <p class="warning"><b>Tip:</b> Always scan for codes before replacing expensive parts.</p>

      <button onclick="showHome()">Start Over</button>
    </div>
  `;
}

function showVehicleLookup() {
  hideHome();

  screen().innerHTML = `
    <div class="card">
      <h2>🚘 Vehicle Lookup</h2>

      <input id="yearInput" placeholder="Year ex: 2006">
      <input id="makeInput" placeholder="Make ex: Ford">
      <input id="modelInput" placeholder="Model ex: F250">
      <input id="engineInput" placeholder="Engine ex: 6.0">

      <button onclick="lookupVehicle()">Search Vehicle</button>

      <div id="vehicleResult"></div>

      <button class="secondary" onclick="showHome()">⬅ Back</button>
    </div>
  `;
}

function lookupVehicle() {
  const year = document.getElementById("yearInput").value.trim();
  const make = document.getElementById("makeInput").value.trim().toLowerCase();
  const model = document.getElementById("modelInput").value.trim().toLowerCase();
  const engine = document.getElementById("engineInput").value.trim().toLowerCase();

  let special = "";

  if (year === "2006" && make.includes("ford") && (model.includes("f250") || model.includes("f-250")) && engine.includes("6.0")) {
    special = `
      <h4>Known 6.0 Powerstroke Checks</h4>
      <ul>
        <li>FICM voltage should stay around 47–48V while cranking</li>
        <li>ICP pressure usually needs about 500 PSI minimum to start</li>
        <li>Check IPR valve, ICP sensor, STC fitting, HPOP leaks, and sync</li>
        <li>Check cam/crank sensor sync on scan tool</li>
        <li>Low batteries can cause false codes and no-start issues</li>
      </ul>
    `;
  }

  document.getElementById("vehicleResult").innerHTML = `
    <div class="card inner">
      <h3>${year || "Unknown Year"} ${make || "Unknown Make"} ${model || "Unknown Model"} ${engine || ""}</h3>

      <p><b>Common fuse box locations:</b></p>
      <ul>
        <li>Under hood near battery</li>
        <li>Driver side under dash</li>
        <li>Passenger kick panel</li>
        <li>Glove box area on some vehicles</li>
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

      <p class="warning"><b>Note:</b> Always verify exact fuse locations with the owner's manual or fuse box cover.</p>
    </div>
  `;
}

function showFuseFinder() {
  hideHome();

  screen().innerHTML = `
    <div class="card">
      <h2>⚡ Fuse Finder</h2>

      <button onclick="fuseHelp('start')">No Start / No Crank</button>
      <button onclick="fuseHelp('fuel')">Fuel Pump / Fuel Issue</button>
      <button onclick="fuseHelp('lights')">Lights / Brake Lights</button>
      <button onclick="fuseHelp('cluster')">Dash / Cluster / Ignition</button>
      <button onclick="fuseHelp('charging')">Battery / Charging</button>

      <div id="fuseResult"></div>

      <button class="secondary" onclick="showHome()">⬅ Back</button>
    </div>
  `;
}

function fuseHelp(type) {
  const help = {
    start: ["Starter relay", "Ignition fuse", "PCM/ECM fuse", "Neutral safety switch circuit", "Main power fuse", "Engine ground"],
    fuel: ["Fuel pump fuse", "Fuel pump relay", "PCM power fuse", "Injector fuse", "Fuel shutoff circuit", "Fuel pump ground"],
    lights: ["Brake light fuse", "Stop lamp switch fuse", "Tail lamp fuse", "Trailer wiring fuse", "Rear grounds", "Multifunction switch"],
    cluster: ["Cluster fuse", "Ignition switch fuse", "Body control module fuse", "PCM communication fuse", "Grounds", "CAN bus wiring"],
    charging: ["Alternator fuse", "Fusible link", "Battery junction fuse", "Main power fuse", "Ground straps", "Serpentine belt"]
  };

  document.getElementById("fuseResult").innerHTML = `
    <div class="card inner">
      <h3>Check These First:</h3>
      <ul>${help[type].map(item => `<li>${item}</li>`).join("")}</ul>
      <p class="warning"><b>Tip:</b> Fuse names change by vehicle. Verify with the fuse box cover or owner's manual.</p>
    </div>
  `;
}

function showCodeLookup() {
  hideHome();

  screen().innerHTML = `
    <div class="card">
      <h2>📟 Code Lookup</h2>

      <input id="codeInput" placeholder="Enter code ex: P0300, U1900, B1352">
      <button onclick="lookupCode()">Search Code</button>

      <div id="codeResult"></div>

      <button class="secondary" onclick="showHome()">⬅ Back</button>
    </div>
  `;
}

function lookupCode() {
  const input = document.getElementById("codeInput").value.toUpperCase().trim();
  const result = document.getElementById("codeResult");

  const codes = {
    P0300: "Random/multiple cylinder misfire. Check spark plugs, coils, fuel pressure, vacuum leaks, compression, and injector operation.",
    P0420: "Catalyst system efficiency below threshold. Check exhaust leaks, oxygen sensors, catalytic converter, and fuel trim issues.",
    P0171: "System too lean. Check vacuum leaks, MAF sensor, fuel pressure, intake leaks, and oxygen sensor readings.",
    P0174: "System too lean on bank 2. Check vacuum leaks, MAF sensor, intake gaskets, fuel pressure, and exhaust leaks.",
    B1352: "Ford ignition key-in circuit fault. Check ignition switch, cluster, fuses, wiring, and related body module codes.",
    U1900: "CAN bus communication fault. Check battery voltage, grounds, fuses, modules, wiring, and network communication."
  };

  if (input === "") {
    result.innerHTML = `<div class="card inner"><p>Enter a code first.</p></div>`;
    return;
  }

  if (codes[input]) {
    result.innerHTML = `<div class="card inner"><p><b>${input}:</b> ${codes[input]}</p></div>`;
  } else if (input.startsWith("P")) {
    result.innerHTML = `<div class="card inner"><p><b>${input}</b>: Powertrain code. Usually engine, fuel, ignition, emissions, or transmission related.</p></div>`;
  } else if (input.startsWith("B")) {
    result.innerHTML = `<div class="card inner"><p><b>${input}</b>: Body system code. Usually lights, ignition, cluster, security, doors, or body module related.</p></div>`;
  } else if (input.startsWith("C")) {
    result.innerHTML = `<div class="card inner"><p><b>${input}</b>: Chassis code. Usually ABS, steering, brakes, suspension, or traction control related.</p></div>`;
  } else if (input.startsWith("U")) {
    result.innerHTML = `<div class="card inner"><p><b>${input}</b>: Communication code. Check battery voltage, grounds, fuses, modules, and CAN wiring.</p></div>`;
  } else {
    result.innerHTML = `<div class="card inner"><p>Enter a valid code like P0300, B1352, C0035, or U1900.</p></div>`;
  }
}

function showAssistant() {
  hideHome();

  screen().innerHTML = `
    <div class="card">
      <h2>🤖 Mechanic Assistant</h2>

      <input id="chatInput" placeholder="Example: 2006 F250 cranks but won't start">
      <button onclick="askAssistant()">Ask</button>

      <div id="chatAnswer"></div>

      <button class="secondary" onclick="showHome()">⬅ Back</button>
    </div>
  `;
}

function askAssistant() {
  const input = document.getElementById("chatInput").value.toLowerCase().trim();
  const answer = document.getElementById("chatAnswer");

  if (input === "") {
    answer.innerHTML = `<div class="card inner"><p>Type a problem first.</p></div>`;
    return;
  }

  let reply = "";

  if (input.includes("6.0") || input.includes("powerstroke") || input.includes("f250") || input.includes("f-250")) {
    reply = "For a 6.0 Powerstroke, check battery voltage while cranking, RPM signal, FICM voltage, ICP pressure, IPR percentage, cam/crank sync, fuel pressure, and wiring harness damage. Low voltage can cause false no-sync and communication issues.";
  } else if (input.includes("no start") || input.includes("won't start") || input.includes("wont start") || input.includes("crank")) {
    reply = "For a no-start, check battery voltage, starter operation, fuel pressure, spark or injector pulse, crank/cam signal, security light, fuses, relays, and trouble codes.";
  } else if (input.includes("click")) {
    reply = "Clicking usually points to low battery voltage, dirty terminals, weak starter, bad starter relay, bad cable, or poor ground.";
  } else if (input.includes("fuse")) {
    reply = "Use Fuse Finder first. Check the system fuse, relay, related module fuse, main power fuse, and grounds. Always verify fuse names with the fuse box cover.";
  } else if (input.includes("overheat") || input.includes("hot")) {
    reply = "Do not keep driving if it is overheating. Check coolant level, leaks, radiator fans, thermostat, water pump, radiator flow, and air trapped in the system.";
  } else if (input.includes("battery") || input.includes("alternator") || input.includes("charging")) {
    reply = "A healthy battery is usually around 12.6V engine off. Running voltage should usually be around 13.5V–14.7V. Check terminals, grounds, alternator fuse, belt, and battery age.";
  } else if (input.includes("brake light") || input.includes("brake lights")) {
    reply = "Check the brake light fuse, bulbs, brake switch power in and out, rear grounds, trailer wiring, and multifunction switch.";
  } else if (input.includes("misfire")) {
    reply = "For a misfire, check spark plugs, coils, wires, injectors, compression, vacuum leaks, fuel pressure, and trouble codes.";
  } else if (input.includes("fuel")) {
    reply = "Fuel problems can come from a weak pump, clogged filter, bad relay, blown fuse, air in the system, bad pressure regulator, or contaminated fuel.";
  } else {
    reply = "Give the year, make, model, engine, symptoms, and any codes. Example: 2006 F250 6.0 cranks but will not start and shows U1900.";
  }

  answer.innerHTML = `
    <div class="card inner">
      <h3>Assistant Reply:</h3>
      <p>${reply}</p>
    </div>
  `;
}
