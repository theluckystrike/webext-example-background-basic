// Background Basic - Service Worker Hello World
// This is the background service worker for the extension

/**
 * Background Service Workers in Manifest V3
 * 
 * Service workers are event-driven scripts that run in the background.
 * They handle events like:
 * - Extension installation/update
 * - Browser events (tabs, bookmarks, etc.)
 * - Alarms and timers
 * - Messages from content scripts and popups
 */

console.log('Background Basic: Service worker starting...');

// ============================================
// Event: Extension Installed
// ============================================
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // First-time installation
    console.log('First time install - setting up initial state');
    
    chrome.storage.local.set({
      installTime: Date.now(),
      version: chrome.runtime.getManifest().version
    });
  } else if (details.reason === 'update') {
    // Extension was updated
    console.log('Extension updated from', details.previousVersion);
  }
});

// ============================================
// Event: Extension Startup
// ============================================
chrome.runtime.onStartup.addListener(() => {
  console.log('Browser started - service worker loaded');
  
  // Initialize any needed state
  chrome.storage.local.get(['initialized'], (result) => {
    if (!result.initialized) {
      chrome.storage.local.set({ initialized: true });
      console.log('First browser startup - initialization complete');
    }
  });
});

// ============================================
// Event: Message from Popup or Content Script
// ============================================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message, 'from', sender.id);
  
  // Handle different message types
  switch (message.type) {
    case 'ping':
      sendResponse({ pong: true, timestamp: Date.now() });
      break;
      
    case 'getStatus':
      chrome.storage.local.get(['installTime', 'version'], (result) => {
        sendResponse({
          status: 'running',
          installTime: result.installTime,
          version: result.version
        });
      });
      break;
      
    case 'logEvent':
      console.log('Event logged:', message.event);
      sendResponse({ logged: true });
      break;
      
    default:
      console.log('Unknown message type:', message.type);
  }
  
  // Return true to indicate async response
  return true;
});

// ============================================
// Event: Alarm (Scheduled Tasks)
// ============================================
chrome.alarms.create('heartbeat', {
  periodInMinutes: 1  // Repeat every minute
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'heartbeat') {
    console.log('Heartbeat:', new Date().toISOString());
  }
});

// ============================================
// Event: Tab Updates
// ============================================
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Only log URLs (not chrome:// URLs)
    if (tab.url.startsWith('http')) {
      console.log('Tab completed:', tab.url);
    }
  }
});

// ============================================
// Event: Context Menu (if enabled)
// ============================================
// chrome.contextMenus?.create({
//   id: 'sample-context-menu',
//   title: 'Sample Menu Item',
//   contexts: ['page']
// });

// chrome.contextMenus?.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'sample-context-menu') {
//     console.log('Context menu clicked on:', tab.url);
//   }
// });

console.log('Background Basic: Service worker initialized');

/**
 * Important Notes about Service Workers:
 * 
 * 1. They can be terminated at any time by the browser
 * 2. They don't persist memory between sessions
 * 3. Use chrome.storage for persistent data
 * 4. Use chrome.alarms for scheduled tasks
 * 5. Listen to events to stay active when needed
 */
