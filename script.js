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
