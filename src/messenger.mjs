let port = null;

const connect = async (name = 'default-port') => {
  port = await browser.runtime.connect({ name });
  return port;
};

const sendMessage = async (type, data = null) => {
  if (!port) {
    port = await connect();
  }
  
  port.postMessage({ type, data });
};

const onMessage = async (callback) => {
  if (!port) {
    port = await connect();
  }
  
  port.onMessage.addListener(callback);
};

const onDisconnect = async (callback) => {
  if (!port) {
    port = await connect();
  }
  
  port.onDisconnect.addListener(callback);
};


export const Messenger = {
  connect,
  onMessage,
  sendMessage,
  onDisconnect
};
