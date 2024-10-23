import { Messages } from './messages.mjs';

// Shared state
const connections = new Map();
let pingInterval = null;

const getActiveTab = async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
};

const sendPingToContentScript = async () => {
  const activeTab = await getActiveTab();
  if (!activeTab) {
    console.log("⚠️ No active tab for ping");
    return;
  }
  
  const contentScriptPort = connections.get(activeTab.id);
  if (contentScriptPort) {
    console.log("📍 Sending ping to content script in tab:", activeTab.id);
    contentScriptPort.postMessage({
      type: Messages.ContentScriptMessages.PING,
      data: { timestamp: Date.now() }
    });
  }
};

const startPingTimer = () => {
  if (pingInterval) {
    clearInterval(pingInterval);
  }
  
  // Send ping every 30 seconds
  pingInterval = setInterval(sendPingToContentScript, 30000);
  console.log("⏰ Ping timer started");
};

const stopPingTimer = () => {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
    console.log("⏰ Ping timer stopped");
  }
};

const relayToContentScript = async (port, data) => {
  console.log("🔄 Background attempting to relay message:", data);
  
  const activeTab = await getActiveTab();
  if (!activeTab) {
    console.log("⚠️ No active tab found");
    return;
  }
  
  console.log("📍 Active tab:", activeTab.id);
  const contentScriptPort = connections.get(activeTab.id);
  
  if (contentScriptPort) {
    console.log("📤 Relaying to content script in tab:", activeTab.id);
    contentScriptPort.postMessage({
      type: Messages.ContentScriptMessages.LOG_TO_CONSOLE,
      data: data
    });
  } else {
    console.log("⚠️ No content script connection found for tab:", activeTab.id);
    
    try {
      await browser.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ["src/content-script.mjs"]
      });
      console.log("✅ Content script injected into tab:", activeTab.id);
    } catch (error) {
      console.error("❌ Failed to inject content script:", error);
    }
  }
};

const handleMessage = async (port, message) => {
  const { type, data } = message;
  console.log("📨 Background received message:", { type, data });
  
  switch (type) {
    case Messages.BackgroundMessages.RELAY_TO_CONTENT:
      await relayToContentScript(port, data);
      break;
    case Messages.BackgroundMessages.SAY_HELLO_TO_BG:
      console.log("👋 Background received hello:", data);
      break;
    case Messages.BackgroundMessages.SAY_BYE_TO_BG:
      console.log("👋 Background received bye:", data);
      break;
  }
};

const handleConnect = (port) => {
  console.log("🔌 New connection from:", port.name);
  
  const connectionId = port.sender?.tab?.id || port.name;
  connections.set(connectionId, port);
  
  console.log("📝 Current connections:", {
    id: connectionId,
    name: port.name,
    tabId: port.sender?.tab?.id
  });
  
  // Start ping timer if this is a content script connection
  if (port.sender?.tab?.id) {
    startPingTimer();
  }
  
  port.onMessage.addListener((message) => handleMessage(port, message));
  
  port.onDisconnect.addListener(() => {
    connections.delete(connectionId);
    console.log("❌ Port disconnected:", {
      id: connectionId,
      remainingConnections: Array.from(connections.keys())
    });
    
    // Stop ping timer if no more content script connections
    if (connections.size === 0) {
      stopPingTimer();
    }
  });
};

const initBackground = () => {
  browser.runtime.onConnect.addListener(handleConnect);
  console.log("✅ Background script initialized");
};

// Initialize the background script
initBackground();