function showAssistant() {
  hideHome();

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>🤖 Mechanic Assistant</h2>
      <input id="chatInput" placeholder="Type your problem...">
      <button onclick="askAssistant()">Ask</button>
      <div id="chatAnswer"></div>
      <button class="back" onclick="showHome()">Back</button>
    </div>
  `;
}

function askAssistant() {
  const input = document.getElementById("chatInput").value.toLowerCase();
  const answer = document.getElementById("chatAnswer");

  if (input.includes("start")) {
    answer.innerHTML = "Check battery, starter, fuel, and spark.";
  } else if (input.includes("overheat")) {
    answer.innerHTML = "Check coolant, leaks, fans, thermostat.";
  } else if (input.includes("battery")) {
    answer.innerHTML = "Check battery voltage and alternator output.";
  } else if (input.includes("brake")) {
    answer.innerHTML = "Check brake switch, wiring, and fuse.";
  } else {
    answer.innerHTML = "Try describing the issue more clearly.";
  }
}
function showAssistant() {
  hideHome();

  document.getElementById("screen").innerHTML = `
    <div class="card">
      <h2>🤖 Mechanic Assistant</h2>
      <p class="small">Ask about won’t start, overheating, battery, brake lights, or a code.</p>
      <input id="chatInput" placeholder="Type your problem...">
      <button onclick="askAssistant()">Ask</button>
      <div id="chatAnswer"></div>
      <button class="back" onclick="showHome()">Back</button>
    </div>
  `;
}

function askAssistant() {
  const input = document.getElementById("chatInput").value.toLowerCase().trim();
  const answer = document.getElementById("chatAnswer");

  if (input === "") {
    answer.innerHTML = `<p class="warn">Type a problem first.</p>`;
    return;
  }

  if (input.includes("code") || input.match(/[pbcu][0-9]{4}/i)) {
    answer.innerHTML = `<p class="warn">Use the Code Lookup button for exact code help.</p>`;
  } else if (input.includes("start") || input.includes("crank") || input.includes("click")) {
    answer.innerHTML = `<p class="good">Start with battery voltage, starter signal, fuel pressure, spark/injector pulse, and codes.</p>`;
  } else if (input.includes("overheat") || input.includes("hot")) {
    answer.innerHTML = `<p class="bad">Do not keep driving hot. Check coolant level, leaks, fans, thermostat, and water pump.</p>`;
  } else if (input.includes("battery") || input.includes("alternator") || input.includes("charging")) {
    answer.innerHTML = `<p class="warn">Check battery voltage: around 12.6V off and 13.5V–14.7V running.</p>`;
  } else if (input.includes("brake")) {
    answer.innerHTML = `<p class="warn">Check brake fuse, brake switch power in/out, rear grounds, bulbs, and trailer wiring.</p>`;
  } else {
    answer.innerHTML = `<p class="warn">I’m not sure yet. Try words like “won’t start,” “overheating,” “battery,” or “brake lights.”</p>`;
  }
}
