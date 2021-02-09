### Introduction

This project is a extension for browser using JQuery + TypeScript + Gulp. It can close tabs quickly. You have 2 ways to open the entry. First one is click icon.

![avatar](https://file.qingflow.com/uploads/file/d70f3404-6aa1-47e2-b6f7-cf88570a187f.png)

Second one is press the key `Alt + Q`.
![avatar](https://file.qingflow.com/uploads/file/002480c2-a596-4aca-90c6-868d98debb0c.png)

There are no difference between them, which have following functions
 
 - Close all left tabs
 - Close all right tabs
 - Close all tabs exclude current tab

### How to run

Execute `npm run start` then project will compile files automatic and generate dist directory, just import it to browser.

### Packup

Execute `npm run build` There is a few dirrence with `npm run start`, only some configs is changed such as minify code. It will generate dist directory too, then you can pack it up via chrome.

### Change log

* **0.0.3:** fix: UI error in firefox
* **0.0.2:** feat: Set keyboard shortcut Alt+Q
* **0.0.1:** feat: Publish basic function