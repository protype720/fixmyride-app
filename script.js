let currentProblem = "";
let step = 0;
let answers = [];
let chatHistory = [];

const screen = () => document.getElementById("screen");
const home = () => document.getElementById("home");

const problems = {
  wontStart: {
    title: "🚗 Won’t Start Diagnostic",
    questions: [
      "When you turn the key, does the engine actually spin/crank?",
      "Are the dash lights bright when the key is on?",
      "When trying to start, do you hear one click or rapid clicking?",
      "Does the engine crank fast like normal, or slow/weak?",
      "Do you hear the fuel pump prime when key is turned on?",
      "Does it try to fire or run for a second with starting fluid?",
      "Is the security/theft light flashing or staying on?",
      "Do you have any trouble codes?"
    ]
  },

  overheating: {
    title: "🔥 Overheating Diagnostic",
    questions: [
      "Is the coolant low when the engine is cold?",
      "Do you see coolant leaking under the vehicle?",
      "Does it overheat while sitting still/idling?",
      "Does it overheat only while driving?",
      "Do the radiator fans turn on?",
      "Does the heater blow hot air?",
      "Is steam coming from the engine bay?",
      "Is there oil in coolant or coolant in oil?"
    ]
  },

  battery: {
    title: "🔋 Battery / Charging Diagnostic",
    questions: [
      "Does the vehicle need jumped often?",
      "Are the battery terminals loose, dirty, or corroded?",
      "Is battery voltage below 12.2V with engine off?",
      "When running, is voltage below 13.5V?",
      "Is the battery light on while running?",
      "Does it crank slow?",
      "Do lights dim badly when starting?",
      "Does the battery die overnight?"
    ]
  },

  brakeLights: {
    title: "💡 Brake Light Diagnostic",
    questions: [
      "Do any brake lights work at all?",
      "Do the tail/running lights work?",
      "Are the brake light bulbs good?",
      "Is the brake light fuse good?",
      "Does the brake pedal switch have power going in?",
      "Does the brake switch send power out when pedal is pressed?",
      "Has trailer wiring been added or messed with?",
      "Do turn signals or hazards work in the rear?"
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
  chatHistory = [];
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
      <p class="muted">Step ${step + 1} of ${p.questions.length}</p>
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

function makeList(items) {
  return items.map(item => `<li>${item}</li>`).join("");
}

function diagnose() {
  let result = "";
  let cause = "";
  let steps = [];

  if (currentProblem === "wontStart") {
    const cranks = answers[0];
    const dashBright = answers[1];
    const clicking = answers[2];
    const cranksWeak = answers[3];
    const fuelPrime = answers[4];
    const startingFluid = answers[5];
    const security = answers[6];

    if (cranks === "no") {
      cause = "No-crank problem";
      result = "The engine is not spinning, so focus on the battery, cables, starter, starter relay, ignition switch, neutral safety switch, and grounds.";
      steps = [
        "Check battery voltage. A good battery should be around 12.6V sitting.",
        "Try jumping it with good cables or a known good battery.",
        "Clean and tighten both battery terminals.",
        "Check the main ground from battery to engine/body.",
        "Listen for starter click. One click can mean bad starter or bad connection.",
        "Check starter relay and starter fuse.",
        "Check if power reaches the starter signal wire when key is turned to start.",
        "If power reaches the starter but it does not crank, suspect starter or engine ground."
      ];
    } else if (dashBright === "no" || clicking === "yes" || cranksWeak === "yes") {
      cause = "Weak voltage / battery cable issue";
      result = "This points toward weak batteries, bad cables, dirty terminals, bad grounds, or a starter drawing too much power.";
      steps = [
        "Charge or replace weak battery first.",
        "Check voltage while cranking. If it drops below about 10V, battery/cable/starter issue is likely.",
        "Clean battery terminals until shiny metal is showing.",
        "Check ground straps from battery to engine and body.",
        "Check positive cable to starter for looseness or corrosion.",
        "If cables and battery are good but crank is still weak, test the starter."
      ];
    } else if (fuelPrime === "no") {
      cause = "Possible fuel pump / fuel relay issue";
      result = "If it cranks normally but you do not hear the fuel pump prime, check fuel pump power, relay, fuse, wiring, and fuel pressure.";
      steps = [
        "Turn key on and listen near fuel tank for pump prime.",
        "Check fuel pump fuse.",
        "Swap/test fuel pump relay if possible.",
        "Check for power at the fuel pump connector.",
        "Check fuel pressure with a gauge if available.",
        "If power and ground are good but pump does not run, suspect bad fuel pump."
      ];
    } else if (startingFluid === "yes") {
      cause = "Fuel delivery or injector control issue";
      result = "If it fires on starting fluid, the engine can run, but fuel delivery or injector control is likely missing.";
      steps = [
        "Check actual fuel pressure.",
        "Check fuel pump fuse and relay.",
        "Replace clogged fuel filter if dirty.",
        "Check injector pulse with a noid light or scan tool.",
        "Scan for crank/cam sensor codes.",
        "Check fuel quality if vehicle has been sitting.",
        "On diesel trucks, check high-pressure oil/injector control data if applicable."
      ];
    } else if (security === "yes") {
      cause = "Possible anti-theft/security issue";
      result = "A flashing or staying-on security light can stop the vehicle from starting.";
      steps = [
        "Try a spare key if available.",
        "Watch security light behavior when key is on.",
        "Check ignition switch and key transponder system.",
        "Scan for body/security codes.",
        "Check related fuses for cluster, ignition, and security module."
      ];
    } else {
      cause = "Crank/no-start needs deeper testing";
      result = "The engine cranks, but it is missing fuel, spark/injector pulse, compression, timing, or sensor signal.";
      steps = [
        "Scan for codes first.",
        "Check RPM signal while cranking.",
        "Check fuel pressure.",
        "Check spark on gas engines.",
        "Check injector pulse.",
        "Check crank and cam sensor signals.",
        "Check compression if fuel/spark/signal are good.",
        "Check timing if everything else checks out."
      ];
    }
  }

  if (currentProblem === "overheating") {
    if (answers[0] === "yes" || answers[1] === "yes") {
      cause = "Coolant leak or low coolant";
      result = "Low coolant is one of the most common overheating causes. Find and fix the leak before replacing random parts.";
      steps = [
        "Only open coolant system when engine is cold.",
        "Fill coolant to correct level.",
        "Pressure test cooling system if possible.",
        "Check radiator, hoses, water pump, thermostat housing, heater hoses, and reservoir.",
        "Fix leaks before driving.",
        "Bleed air from cooling system after filling."
      ];
    } else if (answers[2] === "yes" && answers[4] === "no") {
      cause = "Radiator fan problem";
      result = "If it overheats sitting still and fans do not turn on, suspect fan motor, relay, fuse, wiring, coolant temp sensor, or fan module.";
      steps = [
        "Check fan fuse.",
        "Check fan relay.",
        "Turn A/C on and see if fans activate.",
        "Check for power and ground at fan connector.",
        "If power and ground are good but fan does not spin, suspect bad fan motor."
      ];
    } else if (answers[3] === "yes") {
      cause = "Radiator flow / water pump / thermostat issue";
      result = "If it overheats mainly while driving, check coolant flow, radiator restriction, thermostat, water pump, and airflow.";
      steps = [
        "Check coolant level cold.",
        "Check radiator fins for blockage.",
        "Check thermostat operation.",
        "Check water pump for leaks or poor flow.",
        "Check for collapsed radiator hose.",
        "Flush radiator if clogged."
      ];
    } else if (answers[5] === "no") {
      cause = "No heater heat / possible air pocket or coolant flow issue";
      result = "No hot air from heater while overheating can mean low coolant, trapped air, clogged heater core, thermostat issue, or water pump problem.";
      steps = [
        "Check coolant level cold.",
        "Bleed air from system.",
        "Check heater hoses for heat.",
        "Check thermostat.",
        "Check water pump flow."
      ];
    } else if (answers[7] === "yes") {
      cause = "Possible head gasket / oil cooler issue";
      result = "Oil in coolant or coolant in oil is serious. Do not keep driving it until diagnosed.";
      steps = [
        "Check engine oil for milky color.",
        "Check coolant for oil sludge.",
        "Perform combustion gas test on coolant.",
        "Pressure test cooling system.",
        "Do not replace random parts until confirming head gasket/oil cooler issue."
      ];
    } else {
      cause = "General overheating";
      result = "Overheating can come from low coolant, thermostat, fans, radiator blockage, water pump, air pocket, or head gasket issues.";
      steps = [
        "Check coolant level cold.",
        "Check for leaks.",
        "Verify fans work.",
        "Check thermostat.",
        "Check radiator flow.",
        "Bleed cooling system.",
        "Scan coolant temperature data if possible."
      ];
    }
  }

  if (currentProblem === "battery") {
    if (answers[1] === "yes") {
      cause = "Bad terminal connection";
      result = "Dirty or loose battery terminals can cause no-starts, weak cranking, random lights, and charging problems.";
      steps = [
        "Disconnect negative terminal first.",
        "Clean terminals and cable ends until shiny.",
        "Tighten terminals so they do not move.",
        "Check ground cable to engine/body.",
        "Retest starting and charging voltage."
      ];
    } else if (answers[2] === "yes") {
      cause = "Weak or discharged battery";
      result = "Battery voltage under 12.2V sitting usually means weak, discharged, or failing battery.";
      steps = [
        "Fully charge the battery.",
        "Load test the battery.",
        "Replace battery if it fails load test.",
        "Check for parasitic draw if battery dies again overnight."
      ];
    } else if (answers[3] === "yes" || answers[4] === "yes") {
      cause = "Charging system issue";
      result = "Running voltage under 13.5V or a battery light usually points to alternator, belt, fuse, wiring, or ground problem.";
      steps = [
        "Check serpentine belt.",
        "Check alternator fuse or fusible link.",
        "Check voltage at battery while running.",
        "Check voltage directly at alternator output.",
        "Check alternator connector.",
        "Replace alternator only after wiring/fuse checks."
      ];
    } else if (answers[7] === "yes") {
      cause = "Possible parasitic draw";
      result = "If the battery dies overnight, something may be staying on after the vehicle is off.";
      steps = [
        "Make sure lights, radio, chargers, and accessories are off.",
        "Check glove box, trunk, hood, and dome lights.",
        "Disconnect aftermarket accessories temporarily.",
        "Perform parasitic draw test with a multimeter.",
        "Pull fuses one at a time to find the circuit causing draw."
      ];
    } else {
      cause = "General battery/charging check";
      result = "Battery and charging problems need voltage testing before replacing parts.";
      steps = [
        "Engine off voltage should be about 12.6V.",
        "Cranking voltage should usually stay above 10V.",
        "Running voltage should usually be 13.5V–14.7V.",
        "Check terminals, grounds, belt, alternator fuse, and battery age."
      ];
    }
  }

  if (currentProblem === "brakeLights") {
    if (answers[0] === "no") {
      cause = "Total brake light failure";
      result = "If no brake lights work, start at the fuse and brake pedal switch.";
      steps = [
        "Check brake light fuse.",
        "Check for power going into brake switch.",
        "Press pedal and check power coming out of brake switch.",
        "If power goes in but not out, replace brake switch.",
        "If power goes out but lights do not work, check rear wiring and grounds."
      ];
    } else if (answers[1] === "yes" && answers[0] === "no") {
      cause = "Brake switch or brake fuse likely";
      result = "If tail lights work but brake lights do not, bulbs/grounds may be okay. Focus on brake switch and brake fuse.";
      steps = [
        "Check brake light fuse.",
        "Test brake switch power in and out.",
        "Check wiring from switch to rear lights.",
        "Check multifunction switch on vehicles where brake/turn circuits combine."
      ];
    } else if (answers[6] === "yes") {
      cause = "Trailer wiring problem";
      result = "Trailer wiring is a very common cause of brake light and rear light problems.";
      steps = [
        "Inspect trailer plug for corrosion.",
        "Look for cut/spliced wires.",
        "Disconnect trailer wiring adapter temporarily.",
        "Check rear light grounds.",
        "Repair any melted or twisted wires properly."
      ];
    } else if (answers[7] === "no") {
      cause = "Rear wiring / multifunction switch issue";
      result = "If rear turn signals or hazards also do not work, the issue may be rear wiring, grounds, bulbs, or multifunction switch.";
      steps = [
        "Check rear bulbs.",
        "Check rear grounds.",
        "Check hazard switch operation.",
        "Check turn signal/multifunction switch.",
        "Check rear harness for broken wires."
      ];
    } else {
      cause = "Brake light circuit issue";
      result = "Brake light problems usually come from fuse, bulbs, brake switch, ground, trailer wiring, or multifunction switch.";
      steps = [
        "Check bulbs.",
        "Check brake light fuse.",
        "Test brake switch power in/out.",
        "Check rear grounds.",
        "Inspect trailer wiring.",
        "Check multifunction switch if brake and turn lights share bulbs."
      ];
    }
  }

  screen().innerHTML = `
    <div class="card">
      <h2>🔎 Diagnosis Result</h2>

      <h3>Most Likely Area:</h3>
      <p><b>${cause}</b></p>

      <h3>What It Means:</h3>
      <p>${result}</p>

      <h3>Step-by-Step Checks:</h3>
      <ol>
        ${makeList(steps)}
      </ol>

      <p class="warning"><b>Tip:</b> Do the cheap/easy checks first before replacing expensive parts.</p>

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
  chatHistory = [];

  screen().innerHTML = `
    <div class="card">
      <h2>🤖 Mechanic Assistant</h2>

      <div id="chatBox" class="chat-box">
        <div class="bot-msg">
          Hey 👋 Tell me the year, make, model, engine, and what it’s doing.
          <br><br>
          Example: 2006 Ford F250 6.0 cranks but won’t start.
        </div>
      </div>

      <input id="chatInput" placeholder="Type here..." onkeydown="if(event.key==='Enter') askAssistant()">
      <button onclick="askAssistant()">Send</button>

      <button class="secondary" onclick="showHome()">⬅ Back</button>
    </div>
  `;
}

function addChatMessage(type, message) {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML += `
    <div class="${type === 'user' ? 'user-msg' : 'bot-msg'}">
      ${message}
    </div>
  `;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function askAssistant() {
  const inputBox = document.getElementById("chatInput");
  const input = inputBox.value.trim();
  const lower = input.toLowerCase();

  if (input === "") return;

  addChatMessage("user", input);
  chatHistory.push(input);
  inputBox.value = "";

  const fullChat = chatHistory.join(" ").toLowerCase();

  let reply = "";

  const hasYear = /\b(19|20)\d{2}\b/.test(fullChat);
  const hasMake = /(ford|chevy|chevrolet|dodge|ram|toyota|honda|nissan|jeep|gmc|mercury|mazda|hyundai|kia)/i.test(fullChat);
  const hasVehicle = hasYear && hasMake;

  const hasProblem =
    fullChat.includes("start") ||
    fullChat.includes("crank") ||
    fullChat.includes("click") ||
    fullChat.includes("overheat") ||
    fullChat.includes("hot") ||
    fullChat.includes("battery") ||
    fullChat.includes("alternator") ||
    fullChat.includes("brake") ||
    fullChat.includes("fuel") ||
    fullChat.includes("misfire") ||
    fullChat.includes("code") ||
    fullChat.includes("light") ||
    fullChat.includes("stall") ||
    fullChat.includes("die");

  if (lower === "hi" || lower === "hey" || lower === "hello") {
    reply = "What’s up 👋 What vehicle are we working on? Send year, make, model, engine, and the problem.";
  } else if (hasVehicle && !hasProblem) {
    reply = "Got the vehicle. Now tell me what it’s doing. Example: cranks but won’t start, clicking, overheating, no brake lights, battery dying, etc.";
  } else if (!hasVehicle && hasProblem) {
    reply = "Got the problem. What’s the year, make, model, and engine?";
  } else if (fullChat.includes("6.0") && (fullChat.includes("f250") || fullChat.includes("f-250") || fullChat.includes("powerstroke"))) {
    if (fullChat.includes("no sync") || fullChat.includes("sync")) {
      reply = "On a 6.0 Powerstroke with no sync, check crank sensor, cam sensor, wiring harness, FICM/PCM communication, battery voltage while cranking, and RPM signal. Start with batteries and wiring before tearing into timing.";
    } else if (fullChat.includes("crank") || fullChat.includes("start")) {
      reply = "For a 6.0 Powerstroke crank/no-start, check in this order: 1) batteries stay above 10V cranking, 2) RPM signal shows, 3) FICM voltage around 47–48V, 4) ICP builds enough pressure, 5) IPR %, 6) fuel pressure, 7) cam/crank sync, 8) codes and harness damage.";
    } else {
      reply = "For a 6.0 Powerstroke, send the symptom and any codes. Main checks are batteries, FICM voltage, ICP pressure, IPR %, fuel pressure, sync, RPM while cranking, and wiring.";
    }
  } else if (fullChat.includes("no start") || fullChat.includes("won't start") || fullChat.includes("wont start") || fullChat.includes("crank")) {
    reply = "For a no-start, first decide if it is no-crank or crank/no-start. No-crank = battery, starter, relay, ignition switch, neutral safety switch, grounds. Crank/no-start = fuel pressure, spark/injector pulse, crank/cam signal, security, fuses, and codes.";
  } else if (fullChat.includes("click")) {
    reply = "Clicking usually means weak battery, bad connection, bad ground, starter relay issue, or failing starter. Check battery voltage while trying to crank first.";
  } else if (fullChat.includes("battery") || fullChat.includes("alternator")) {
    reply = "Battery test: engine off should be around 12.6V. While cranking, try to stay above 10V. Running should usually be 13.5V–14.7V. Check terminals, grounds, belt, alternator fuse, and battery age.";
  } else if (fullChat.includes("brake light") || fullChat.includes("brake lights")) {
    reply = "For brake lights, check in order: bulbs, brake light fuse, brake switch power in, brake switch power out when pedal is pressed, rear grounds, trailer wiring, and multifunction switch.";
  } else if (fullChat.includes("overheat") || fullChat.includes("hot")) {
    reply = "Do not keep driving it hot. Check coolant cold, leaks, fans, thermostat, water pump, radiator flow, and trapped air. If coolant and oil are mixing, stop and test for head gasket/oil cooler issues.";
  } else if (hasVehicle) {
    reply = "Got the vehicle. Tell me the exact symptom and any codes, and I’ll narrow it down.";
  } else {
    reply = "Tell me year, make, model, engine, symptoms, and codes. Example: 2006 Ford F250 6.0 cranks but won’t start with U1900.";
  }

  addChatMessage("bot", reply);
}
