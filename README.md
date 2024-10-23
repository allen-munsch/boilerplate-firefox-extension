# Hello World Firefox Extension

A simple Firefox extension that demonstrates messaging between popup, background script, and content script using manifest V3.

No build packs, no transpiling, no fluff, just javscript, json, css, html.

## Installation

1. Open Firefox
2. Navigate to about:debugging
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the manifest.json file from this directory

## Features

- Popup with buttons to send messages
- Background script that responds to messages
- Content script that can receive messages
- Messaging system between all components

## Structure

- manifest.json: Extension configuration
- popup.html: Extension popup interface
- src/
  - messages.js: Message type definitions
  - messenger.js: Message sending utilities
  - background.js: Background script
  - content-script.js: Content script
  - popup.js: Popup functionality
