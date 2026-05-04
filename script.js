let currentProblem = "";
let step = 0;
let answers = [];

const problems = {
  wontStart: {
    title: "🚗 Won’t Start",
    questions: [
      "Does the engine crank when you turn the key?",
      "Do the dash lights come on?",
      "Do you hear clicking?",
      "Does it try to start with starting fluid?",
      "Is the security light flashing or staying on?"
    ]
  },

  overheating: {
    title: "🔥 Overheating",
    questions: [
      "Is the coolant level low?",
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
      "Is battery voltage below 12.2V with engine off?",
      "Is voltage below 13.5V while running?",
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
      "Has trailer wiring been messed with?"
    ]
  }
};

const codes = {
  P0300: "Random/multiple cylinder misfire. Check spark plugs, coils, fuel pressure, vacuum leaks, and compression.",
  P0301: "Cylinder 1 misfire. Check spark plug, coil, injector, compression, and wiring.",
  P0302: "Cylinder 2 misfire. Check spark plug, coil, injector, compression, and wiring.",
  P0303: "Cylinder 3 misfire. Check spark plug, coil, injector, compression, and wiring.",
  P0304: "Cylinder 4 misfire. Check spark plug, coil, injector, compression, and wiring.",
  P0305: "Cylinder 5 misfire. Check spark plug, coil, injector, compression, and wiring.",
  P0306: "Cylinder 6 misfire. Check spark plug, coil, injector, compression, and wiring.",
  P0307: "Cylinder 7 misfire. Check spark plug, coil, injector, compression, and wiring.",
  P0308: "Cylinder 8 misfire. Check spark plug, coil, injector, compression, and wiring.",

  P0171: "System too lean bank 1. Check vacuum leaks, intake leaks, MAF sensor, fuel pressure, and exhaust leaks.",
  P0174: "System too lean bank 2. Check vacuum leaks, intake leaks, MAF sensor, fuel pressure, and exhaust leaks.",
  P0172: "System too rich bank 1. Check fuel pressure, leaking injectors, MAF sensor, oxygen sensors, and air filter.",
  P0175: "System too rich bank 2. Check fuel pressure, leaking injectors, MAF sensor, oxygen sensors, and air filter.",

  P0420: "Catalyst efficiency below threshold bank 1. Could be catalytic converter, oxygen sensor, or exhaust leak.",
  P0430: "Catalyst efficiency below threshold bank 2. Could be catalytic converter, oxygen sensor, or exhaust leak.",

  P0128: "Coolant temperature below thermostat regulating temp. Usually thermostat stuck open or low coolant.",
  P0113: "Intake air temperature sensor high input. Check IAT sensor, wiring, connector, and intake air temp reading.",
  P0118: "Coolant temperature sensor high input. Check coolant temp sensor, wiring, connector, and coolant level.",

  P0335: "Crankshaft position sensor circuit fault. Check crank sensor, wiring, connector, and PCM signal.",
  P0340: "Camshaft position sensor circuit fault. Check cam sensor, wiring, connector, and PCM signal.",
  P2614: "Camshaft position output circuit/open. Check cam sensor wiring and PCM connection.",
  P2617: "Crankshaft position output circuit/open. Check crank sensor wiring and PCM connection.",

  P0401: "EGR flow insufficient. Check EGR valve, clogged passages, vacuum lines, wiring, and DPFE/pressure sensor.",
  P0402: "EGR flow excessive. Check EGR valve stuck open, wiring, vacuum control, and sensor readings.",

  P0442: "Small EVAP leak. Check gas cap, EVAP hoses, purge valve, vent valve, and leaks.",
  P0455: "Large EVAP leak. Check gas cap, EVAP hoses, purge valve, vent valve, and fuel tank leaks.",
  P0456: "Very small EVAP leak. Check gas cap, EVAP lines, purge valve, and vent valve.",

  P0101: "MAF sensor range/performance. Check MAF sensor, air filter, intake leaks, wiring, and dirty sensor.",
  P0102: "MAF sensor low input. Check MAF sensor, wiring, connector, and intake leaks.",
  P0103: "MAF sensor high input. Check MAF sensor, wiring, connector, and sensor signal.",

  P0131: "O2 sensor low voltage bank 1 sensor 1. Check oxygen sensor, wiring, exhaust leaks, and lean condition.",
  P0132: "O2 sensor high voltage bank 1 sensor 1. Check oxygen sensor, wiring, rich condition, and fuel pressure.",
  P0151: "O2 sensor low voltage bank 2 sensor 1. Check oxygen sensor, wiring, exhaust leaks, and lean condition.",
  P0152: "O2 sensor high voltage bank 2 sensor 1. Check oxygen sensor, wiring, rich condition, and fuel pressure.",

  P0500: "Vehicle speed sensor fault. Check VSS sensor, wiring, ABS module data, and speedometer signal.",
  P0700: "Transmission control system fault. Scan the transmission module for more specific codes.",

  P2284: "ICP sensor circuit range/performance. Check ICP sensor, oil pressure, wiring, and connector.",
  P2285: "ICP sensor circuit low. Check ICP sensor, wiring, connector, and 5V reference.",
  P2286: "ICP sensor circuit high. Check ICP sensor, wiring, connector, and sensor signal.",
  P2290: "Injector control pressure too low. On diesels, check oil level, ICP, IPR, HPOP, leaks, and base oil pressure.",
  P2291: "Injector control pressure too low while cranking. Check oil level, ICP/IPR, HPOP, leaks, and cranking speed.",

  B1352: "Ford ignition key-in circuit fault. Check ignition switch, cluster, fuses, and wiring.",
  U0100: "Lost communication with PCM/ECM. Check power, grounds, fuses, battery voltage, and CAN wiring.",
  U1900: "CAN bus communication fault. Check modules, grounds, wiring, low voltage, and cluster/PCM communication."
};

function hideHome() {
  document.getElementById("home").style.display = "none";
}

function showHome() {
  document.getElementById("home").style.display = "block";
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
      <p class="small">Question ${step + 1} of ${p.questions.length}</p>
      <p class="question">${p.questions[step]}</p>

      <button onclick="answer('yes')">Yes</button>
      <button onclick="answer('no')">No</button>
      <button onclick="answer('not sure')">Not Sure</button>
      <button class="back" onclick="showHome()">Back</button>
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

  if (currentProblem === "wontStart") result = diagnoseWontStart();
  if (currentProblem === "overheating") result = diagnoseOverheating();
  if (currentProblem === "battery") result = diagnoseBattery();
  if (currentProblem === "brakeLights") result = diagnoseBrakeLights();

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>Diagnosis</h2>
      ${result}
      <button onclick="showHome()">Start Over</button>
    </div>
  `;
}

function diagnoseWontStart() {
  if (answers[1] === "no") {
    return `
      <p class="bad">Most likely: dead battery, bad cable, bad ground, or blown main fuse.</p>
      <ol>
        <li>Check battery voltage.</li>
        <li>Clean and tighten terminals.</li>
        <li>Check main fuses.</li>
        <li>Check engine/body grounds.</li>
      </ol>
    `;
  }

  if (answers[0] === "no" && answers[2] === "yes") {
    return `
      <p class="warn">Most likely: weak battery, bad starter, bad relay, or bad cable.</p>
      <ol>
        <li>Load test battery.</li>
        <li>Check voltage drop while cranking.</li>
        <li>Check starter relay.</li>
        <li>Check starter signal wire.</li>
      </ol>
    `;
  }

  if (answers[0] === "yes" && answers[3] === "yes") {
    return `
      <p class="warn">Most likely: fuel delivery issue.</p>
      <ol>
        <li>Check fuel pressure.</li>
        <li>Check fuel pump.</li>
        <li>Check fuel filter.</li>
        <li>Check injector signal.</li>
      </ol>
    `;
  }

  if (answers[4] === "yes") {
    return `
      <p class="warn">Possible security, key, ignition, or module communication issue.</p>
      <ol>
        <li>Try another key.</li>
        <li>Scan body/security codes.</li>
        <li>Check ignition switch.</li>
        <li>Check PCM/cluster communication.</li>
      </ol>
    `;
  }

  return `
    <p class="good">Start with basic no-start testing.</p>
    <ol>
      <li>Battery voltage/load test.</li>
      <li>Scan for codes.</li>
      <li>Check fuel pressure.</li>
      <li>Check spark or injector pulse.</li>
      <li>Check crank/cam sensor signal.</li>
    </ol>
  `;
}

function diagnoseOverheating() {
  if (answers[0] === "yes" || answers[1] === "yes") {
    return `
      <p class="bad">Most likely: coolant leak or low coolant.</p>
      <ol>
        <li>Do not keep driving hot.</li>
        <li>Pressure test cooling system.</li>
        <li>Check hoses, radiator, water pump, and reservoir.</li>
        <li>Refill/bleed system after fixing leak.</li>
      </ol>
    `;
  }

  if (answers[2] === "no") {
    return `
      <p class="warn">Possible radiator fan issue.</p>
      <ol>
        <li>Check fan fuse/relay.</li>
        <li>Check fan motor.</li>
        <li>Check coolant temp sensor.</li>
        <li>Check wiring.</li>
      </ol>
    `;
  }

  return `
    <p class="warn">Possible thermostat, air pocket, radiator restriction, or water pump issue.</p>
    <ol>
      <li>Check thermostat.</li>
      <li>Bleed air from cooling system.</li>
      <li>Check radiator flow.</li>
      <li>Check water pump operation.</li>
    </ol>
  `;
}

function diagnoseBattery() {
  if (answers[3] === "yes" || answers[4] === "yes") {
    return `
      <p class="bad">Most likely: alternator or charging system issue.</p>
      <ol>
        <li>Check running voltage.</li>
        <li>Check alternator belt.</li>
        <li>Check alternator fuse/fusible link.</li>
        <li>Check grounds and battery cables.</li>
      </ol>
    `;
  }

  if (answers[1] === "yes") {
    return `
      <p class="warn">Most likely: bad battery connection.</p>
      <ol>
        <li>Clean battery terminals.</li>
        <li>Tighten cables.</li>
        <li>Check ground straps.</li>
        <li>Retest voltage.</li>
      </ol>
    `;
  }

  return `
    <p class="good">Start with battery test and parasitic draw check.</p>
    <ol>
      <li>Fully charge battery.</li>
      <li>Load test battery.</li>
      <li>Check alternator output.</li>
      <li>Check for power draw overnight.</li>
    </ol>
  `;
}

function diagnoseBrakeLights() {
  if (answers[0] === "no" && answers[1] === "yes") {
    return `
      <p class="warn">Most likely: brake switch, ground, wiring, or multifunction switch.</p>
      <ol>
        <li>Check power into brake switch.</li>
        <li>Check power out when pedal is pressed.</li>
        <li>Check rear grounds.</li>
        <li>Check wiring to rear lights.</li>
      </ol>
    `;
  }

  if (answers[4] === "yes") {
    return `
      <p class="bad">Trailer wiring may be shorted or hacked up.</p>
      <ol>
        <li>Inspect trailer plug wiring.</li>
        <li>Disconnect trailer harness and retest.</li>
        <li>Check fuse again.</li>
        <li>Repair damaged wires properly.</li>
      </ol>
    `;
  }

  return `
    <p class="good">Brake light circuit needs step-by-step testing.</p>
    <ol>
      <li>Check bulbs.</li>
      <li>Check fuse.</li>
      <li>Check brake switch power in/out.</li>
      <li>Check rear grounds.</li>
    </ol>
  `;
}

function showCodeLookup() {
  hideHome();

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>📟 Code Lookup</h2>
      <p class="small">Enter a code like P0300, P0340, B1352, U1900</p>
      <input id="codeInput" placeholder="Enter code">
      <button onclick="lookupCode()">Search</button>
      <div id="codeResult"></div>
      <button class="back" onclick="showHome()">Back</button>
    </div>
  `;
}

function lookupCode() {
  const input = document.getElementById("codeInput").value.toUpperCase().trim();
  const result = document.getElementById("codeResult");

  if (input === "") {
    result.innerHTML = `<p class="warn">Enter a code first.</p>`;
    return;
  }

  if (codes[input]) {
    result.innerHTML = `<p class="good"><b>${input}</b>: ${codes[input]}</p>`;
    return;
  }

  const firstLetter = input.charAt(0);
  const secondChar = input.charAt(1);

  if (firstLetter === "P" && secondChar === "0") {
    result.innerHTML = `
      <p class="warn"><b>${input}</b>: Generic powertrain code.</p>
      <p>This usually relates to engine, fuel, ignition, emissions, sensors, or transmission.</p>
      <ol>
        <li>Search the exact code for the vehicle.</li>
        <li>Check freeze-frame data if your scanner has it.</li>
        <li>Start with wiring, connectors, voltage, and obvious leaks.</li>
      </ol>
    `;
    return;
  }

  if (firstLetter === "P" && secondChar === "1") {
    result.innerHTML = `
      <p class="warn"><b>${input}</b>: Manufacturer-specific powertrain code.</p>
      <p>You need the vehicle make, model, year, and engine to decode this one correctly.</p>
      <ol>
        <li>Look up the code for that exact vehicle.</li>
        <li>Check service info or forums for that make.</li>
        <li>Do not replace parts until you confirm the test path.</li>
      </ol>
    `;
    return;
  }

  if (firstLetter === "B") {
    result.innerHTML = `
      <p class="warn"><b>${input}</b>: Body system code.</p>
      <p>This usually relates to ignition, cluster, security, lights, doors, interior electronics, or body module wiring.</p>
      <ol>
        <li>Check fuses.</li>
        <li>Check battery voltage and grounds.</li>
        <li>Check related switches and connectors.</li>
        <li>Scan body/module data if possible.</li>
      </ol>
    `;
    return;
  }

  if (firstLetter === "C") {
    result.innerHTML = `
      <p class="warn"><b>${input}</b>: Chassis system code.</p>
      <p>This usually relates to ABS, brakes, steering, suspension, traction control, or wheel speed sensors.</p>
      <ol>
        <li>Check ABS/wheel speed sensor wiring.</li>
        <li>Check brake system faults.</li>
        <li>Inspect connectors near wheels.</li>
        <li>Scan ABS module for more detail.</li>
      </ol>
    `;
    return;
  }

  if (firstLetter === "U") {
    result.innerHTML = `
      <p class="warn"><b>${input}</b>: Network communication code.</p>
      <p>This usually means one module lost communication with another module.</p>
      <ol>
        <li>Check battery voltage first.</li>
        <li>Check grounds.</li>
        <li>Check fuses for modules.</li>
        <li>Inspect CAN bus wiring/connectors.</li>
        <li>Check PCM/cluster/module communication.</li>
      </ol>
    `;
    return;
  }

  result.innerHTML = `
    <p class="bad">Code not recognized.</p>
    <p>Try codes like P0300, P0340, B1352, C0035, or U1900.</p>
  `;
}