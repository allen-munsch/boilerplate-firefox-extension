import { Messages } from "./messages.mjs";
import { Messenger } from "./messenger.mjs";

document.getElementById('sayHello').addEventListener('click', async () => {
  console.log("🔘 Hello button clicked");
  await Messenger.sendMessage(Messages.BackgroundMessages.RELAY_TO_CONTENT, {
    message: "Hello from popup! The time is: " + new Date().toLocaleTimeString()
  });
  document.getElementById('response').textContent = "Sent hello message!";
});

document.getElementById('sayBye').addEventListener('click', async () => {
  console.log("🔘 Bye button clicked");
  await Messenger.sendMessage(Messages.BackgroundMessages.RELAY_TO_CONTENT, {
    message: "Goodbye from popup! The time is: " + new Date().toLocaleTimeString()
  });
  document.getElementById('response').textContent = "Sent goodbye message!";
});

// Connect when popup opens
console.log("🚀 Popup script starting");
const port = Messenger.connect('popup-port');
console.log("🔌 Popup connected with port:", port);