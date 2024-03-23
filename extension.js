const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const codeScanningService = require("./codeScanningService.js");

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.openScanningWindow",
    function () {
      const panel = vscode.window.createWebviewPanel(
        "codeScanningWindow",
        "Code Scanning",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage((message) => {
        console.log("Message received from webview:", message);
        switch (message.command) {
          case "startScan":
            startCodeScan(panel, vscode);
            break;
        }
      });

      const htmlPath = path.join(
        context.extensionPath,
        "webview",
        "index.html"
      );
      panel.webview.html = getWebviewContent(htmlPath, panel.webview);
    }
  );

  context.subscriptions.push(disposable);
}

async function startCodeScan(panel) {
  console.log("startCodeScan function called");
  // Update the status in the webview
  panel.webview.postMessage({
    command: "updateStatus",
    status: "Starting scan...",
  });

  // Get the workspace folder path
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    const workspaceFolderPath = workspaceFolders[0].uri.fsPath;

    // Find all JavaScript files in the workspace folder
    const jsFiles = await vscode.workspace.findFiles("**/*.*");

    // Read the content of each JavaScript file
    const codebase = await Promise.all(
      jsFiles.map(async (file) => {
        const content = await vscode.workspace.fs.readFile(file);
        return {
          path: file.fsPath,
          content: content.toString(),
        };
      })
    );

    // Perform the code scanning
    const scanResults = await codeScanningService.scanCodebase(
      codebase,
      vscode,
      panel
    );

    // Send the scan results to the webview
    panel.webview.postMessage({
      command: "displayVulnerabilities",
      vulnerabilities: scanResults,
    });
    panel.webview.postMessage({
      command: "updateStatus",
      status: "Finished scan",
    });
  } else {
    vscode.window.showErrorMessage("No workspace folder is open.");
    panel.webview.postMessage({
      command: "updateStatus",
      status: "No workspace folder open",
    });
  }
}

function getWebviewContent(htmlPath, webview) {
  const htmlContent = fs.readFileSync(htmlPath, "utf8");

  // Get the directory path of the HTML file
  const dirPath = path.dirname(htmlPath);

  // Convert the local file paths to webview URIs
  const htmlContentWithWebviewUrls = htmlContent.replace(
    /(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g,
    (match, p1, p2) => {
      const filePath = path.join(dirPath, p2);
      const fileUri = webview.asWebviewUri(vscode.Uri.file(filePath));
      return `${p1}${fileUri}"`;
    }
  );

  // Add the necessary scripts for communication
  const scriptPath = path.join(dirPath, "main.js");
  const scriptUri = webview.asWebviewUri(vscode.Uri.file(scriptPath));
  const cspSource = webview.cspSource;
  const htmlWithScripts = `
	  <!DOCTYPE html>
	  <html lang="en">
	  <head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Code Scanning</title>
		${htmlContentWithWebviewUrls}
	  </head>
	  <body>
		<script>
		  (function() {
			const vscode = acquireVsCodeApi();
			window.addEventListener('message', event => {
			  const message = event.data;
			  switch (message.command) {
				case 'updateStatus':
				  updateStatus(message.status);
				  break;
				// ... (handle other commands)
			  }
			});
		  })();
		</script>
		<script src="${scriptUri}"></script>
	  </body>
	  </html>
	`;

  return htmlWithScripts;
}

exports.activate = activate;
