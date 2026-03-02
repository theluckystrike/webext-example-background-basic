# Learning: Background Service Workers

## What is a Service Worker?

In Manifest V3, background pages were replaced with **service workers**. These are event-driven scripts that run in the background and handle various extension events.

## Key Concept: Event-Driven Architecture

Service workers don't have a persistent state - they wake up when events occur:

```javascript
chrome.runtime.onInstalled.addListener(() => {
  // Handle installation
});

chrome.alarms.create('myAlarm', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  // Handle alarm
});
```

## Manifest Configuration

```json
{
  "background": {
    "service_worker": "background.js"
  }
}
```

Note: There's no `"background"` key in the web_accessible_resources - it's separate.

## Common Events

### Extension Lifecycle

```javascript
// Fired when extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Reason:', details.reason); // 'install', 'update', 'chrome_update'
});

// Fired when browser starts
chrome.runtime.onStartup.addListener(() => {
  console.log('Browser started');
});
```

### Messages

```javascript
// Receive messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message:', message);
  sendResponse({ response: 'data' });
  return true; // Keep channel open for async response
});

// Send messages
chrome.runtime.sendMessage({ type: 'hello' }, (response) => {
  console.log('Response:', response);
});
```

### Alarms

```javascript
// Create alarm
chrome.alarms.create('heartbeat', { periodInMinutes: 5 });

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name);
});
```

### Tabs

```javascript
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Tab loaded:', tab.url);
  }
});
```

## Important Differences from MV2

| MV2 Background Page | MV3 Service Worker |
|--------------------|-------------------|
| Persistent | Can be terminated |
| Long-running timers | Use chrome.alarms |
| DOM access | No DOM access |
| Always loaded | Event-driven |

## Best Practices

1. **Don't rely on memory**: Store state in chrome.storage
2. **Use chrome.alarms**: For timing, not setTimeout
3. **Handle termination**: Service workers can be killed anytime
4. **Minimize wake-ups**: Only listen to events you need
5. **Use async patterns**: Most APIs are asynchronous

## Debugging Service Workers

1. Go to `chrome://extensions/`
2. Find your extension
3. Click "service worker" link under Inspect Views
4. Use Console to see logs

## Common Patterns

### Persistent Storage

```javascript
// Save state
chrome.storage.local.set({ key: 'value' });

// Load state
chrome.storage.local.get(['key'], (result) => {
  console.log(result.key);
});
```

### Tab Communication

```javascript
// From background to tab
chrome.tabs.sendMessage(tabId, { message: 'hello' });

// From content script to background
chrome.runtime.sendMessage({ message: 'from content' });
```

## Next Steps

Now that you understand service workers, learn about:
- **Messaging**: Communication patterns between components
- **Storage**: chrome.storage API for persistence
- **Alarms**: Scheduled tasks in extensions

## Resources

- [Background Service Worker Docs](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
- [MV3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
