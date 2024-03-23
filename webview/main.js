const vscode = acquireVsCodeApi();

// Add event listener to the scan button
document.getElementById("scanButton").addEventListener("click", startScan);

// Function to start the code scanning process
function startScan() {
  console.log("startScan function called");
  // Send a message to the extension to initiate the scan
  vscode.postMessage({ command: "startScan" });
}

// Function to update the status text
function updateStatus(status) {
  document.getElementById("scanStatus").textContent = status;
}

// Function to display the scanning steps
function displaySteps(steps) {
  const stepsList = document.getElementById("stepsList");
  stepsList.innerHTML = "";

  steps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });
}

function displayVulnerabilities(vulnerabilities) {
  const vulnerabilitiesContainer = document.getElementById("vulnerabilities");
  vulnerabilitiesContainer.innerHTML = "";

  vulnerabilities.forEach((vulnerability) => {
    const vulnerabilityElement = document.createElement("div");
    vulnerabilityElement.className = "vulnerability";
    vulnerabilityElement.innerHTML = `
      <div class="vulnerability-header">
        <span class="vulnerability-icon">⚠️</span>
        <div>
          <h3 class="vulnerability-heading">${vulnerability.type}</h3>
          <p class="vulnerability-info">File: ${vulnerability.file} | Line: ${
      vulnerability.line
    }</p>
        </div>
      </div>
      <div class="vulnerability-details">
        <p>Certainty: ${vulnerability.certainty}</p>
        <p>Tags: ${vulnerability.tags.join(", ")}</p>
        <p>Description: ${vulnerability.description}</p>
      </div>
    `;
    vulnerabilitiesContainer.appendChild(vulnerabilityElement);
  });
}

// Listen for messages from the extension
window.addEventListener("message", (event) => {
  const message = event.data;

  switch (message.command) {
    case "updateStatus":
      updateStatus(message.status);
      break;
    case "displaySteps":
      displaySteps(message.steps);
      break;
    case "displayVulnerabilities":
      displayVulnerabilities(message.vulnerabilities);
      break;
  }
});
