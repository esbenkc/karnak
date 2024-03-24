<img align="left" src="./webview/logo.png" width="75">

# Karnak

Do you trust AI-based software engineering systems? Karnak is a defense program against obscured injection of malicious code in your own programs from autonomous software engineering systems. You can run it before you push it to your servers to receive an in-depth vulnerability report.

This program is intended to target unintended proliferation risks of autonomous AI agents.

## Features

- Scans all files in your workspace for vulnerabilities
- Provides detailed reports of all vulnerabilities found by type, file, and line

## Demo video

[![KARNAK V0.0.1 DEMONSTRATION](http://img.youtube.com/vi/2D110vKpqWU/0.jpg)](http://www.youtube.com/watch?v=2D110vKpqWU "KARNAK V0.0.1")

## Set up your OpenAI API key

Go to the VS Code settings (File > Preferences > Settings or Code > Preferences > Settings), search for "codeScanningExtension.openaiApiKey", and enter your API key.

## Experimental results from [`test-workspace`](./test-workspace/)

| file         | vulnerability                                                                                        | lines   | result |
| ------------ | ---------------------------------------------------------------------------------------------------- | ------- | ------ |
| `eval.php`   | The variable name is passed into the evaluation block, making it vulnerable to remote code execution | 9       | TP     |
| `data.ts`    | An example of sensitive data exposure in a GraphQL database                                          | 7 to 13 | TP     |
| `index.html` | No vulnerability                                                                                     |         | TN     |

TODO: Add testing on the [OWASP Benchmark](https://owasp.org/www-project-benchmark/) or other more representative datasets

## Known shortcomings

- Current vulnerability visualization is not conditional on the vulnerability severity
- Using the same model that has written the code to evaulate the code is subject to multi-instance coordination on deception
- It currently scans _all files_ in your workspace, which can be solved by adhering to any type of .gitignore file found in the workspace
- It is computationally expensive to run
- It currently covers all vulnerabilities and can have improved targeting of AGI proliferation risk
