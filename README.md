# Background Basic Chrome Extension

A Chrome extension demonstrating background service worker - the hello world for background scripts.

## What It Does

This extension demonstrates the background service worker in Manifest V3:
- Logs extension install/update events
- Handles messages from popups and content scripts
- Runs a heartbeat alarm every minute
- Tracks browser startup events
- Monitors tab updates

The service worker runs in the background and handles events.

## How to Install

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `src` folder of this extension

## How to Test

1. Open the extension in Chrome
2. Right-click the extension icon → "Inspect popup" 
3. This opens Service Worker DevTools
4. Check Console for logs:
   - "Service worker starting..."
   - "Extension installed: install"
   - "Heartbeat: [timestamp]"

## Project Structure

```
webext-example-background-basic/
├── src/
│   ├── manifest.json      # Extension configuration
│   ├── background.js      # Service worker
│   └── icons/             # Extension icons
├── README.md              # This file
├── LEARN.md               # Learning guide
└── package.json           # Package config
```

## Key Concepts

### Service Workers vs Background Pages

In Manifest V3, background pages were replaced with service workers:
- **MV2**: Background pages (persistent HTML/JS)
- **MV3**: Service workers (event-driven, can be terminated)

### Service Worker Lifecycle

1. **Load**: When extension loads or browser starts
2. **Idle**: Can be terminated after inactivity
3. **Wake**: Re-loads when events occur
4. **Terminate**: Browser may kill when idle

### Key Events

```javascript
// Extension installed/updated
chrome.runtime.onInstalled.addListener()

// Browser started
chrome.runtime.onStartup.addListener()

// Messages from other parts
chrome.runtime.onMessage.addListener()

// Scheduled alarms
chrome.alarms.onAlarm.addListener()

// Browser events
chrome.tabs.onUpdated.addListener()
chrome.bookmarks.onCreated.addListener()
```

## Learning Path

1. [Hello World](../webext-example-hello-world) - Minimal extension
2. [Popup Basic](../webext-example-popup-basic) - Add a popup UI
3. [Content Script](../webext-example-content-script-basic) - Interact with web pages
4. **Background Basic** (you are here) - Background processing
5. [Options Page](../webext-example-options-page) - Add settings

## Related Examples

- [webext-alarm-scheduler](https://github.com/zovo/chrome-alarm-scheduler) - Scheduled tasks
- [webext-event-bus](https://github.com/zovo/webext-event-bus) - Event system

## License

MIT
