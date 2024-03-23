<img align="left" src="./webview/logo.png" width="75">

# Karnak

Do you trust AI-based software engineering systems? Karnak is a defense program against obscured injection of malicious code in your own programs from autonomous software engineering systems. You can run it before you push it to your servers to receive an in-depth vulnerability report.

## Features

- Scans all files in your workspace for vulnerabilities
- Provides detailed reports of all vulnerabilities found by type, file, and line

## Set up your OpenAI API key

Go to the VS Code settings (File > Preferences > Settings or Code > Preferences > Settings), search for "codeScanningExtension.openaiApiKey", and enter your API key.

## Experimental results from [`test-workspace`](./test-workspace/)

| file         | vulnerability                                                                                        | lines   | result |
| ------------ | ---------------------------------------------------------------------------------------------------- | ------- | ------ |
| `eval.php`   | The variable name is passed into the evaluation block, making it vulnerable to remote code execution | 9       | TP     |
| `data.ts`    | An example of sensitive data exposure in a GraphQL database                                          | 7 to 13 | TP     |
| `index.html` | No vulnerability                                                                                     |         | TN     |

TODO: Add testing on the [OWASP Benchmark](https://owasp.org/www-project-benchmark/) or other more representative datasets
