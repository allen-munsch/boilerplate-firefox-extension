(async () => {
  const messagesUrl = browser.runtime.getURL("src/messages.mjs");
  const messengerUrl = browser.runtime.getURL("src/messenger.mjs");
  
  console.log("Loading modules from:", { messagesUrl, messengerUrl });
  const { Messages } = await import(messagesUrl);
  const { Messenger } = await import(messengerUrl);
  const handleHello = async (data) => {
    console.log("Content script received hello:", data);
  };
  
  const handleBye = async (data) => {
    console.log("Content script received bye:", data);
  };

  const handlePing = async (data) => {
    console.log("Content script received ping:", data);
  };
  
  const handleLogToConsole = async (data) => {
    console.log("🟢 Content Script received message:", data);
    console.log("📝 Message content:", data.message);
  };
  
  const handleMessage = (message) => {
    console.log("📨 Content Script received:", message);
    const { type, data } = message;
    
    switch (type) {
      case Messages.ContentScriptMessages.SAY_HELLO_TO_CS:
        handleHello(data);
        break;
      case Messages.ContentScriptMessages.SAY_BYE_TO_CS:
        handleBye(data);
        break;
      case Messages.ContentScriptMessages.LOG_TO_CONSOLE:
        handleLogToConsole(data);
        break;
      case Messages.ContentScriptMessages.PING:
        handlePing(data);
        break;
      default:
        console.log("⚠️ Unhandled message type:", type);
    }
  };
      
  const port = await Messenger.connect('content-script-port');
  console.log("🔌 Port connected:", port);
  
  await Messenger.onMessage(handleMessage);

})();