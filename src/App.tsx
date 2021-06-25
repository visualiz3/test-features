import React from "react";
import logo from "./logo.svg";
import "./App.css";

const publicVapidKey =
  "BDxB08uFViF3YLCde8Rj__QifQ9jt8qrWsA1D_syqJE1wcgCt3yNnPPdg70aY8vCae0Sy9xdrtP9sXOTkqEOCiw";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={notifyMe}>Ask for permission</button>
        <button onClick={subscribeToWebPush}>
          Subscribe this client to webpush
        </button>
        <button onClick={() => sendBroadcast({})}>
          Send notification to all subscribers open main page
        </button>
        <button onClick={() => sendBroadcast({body:"Opening tcm page", url:"https://dev-dfecomm.netlify.app/ShopGen02/dftcm"})}>
          Send notification to all subscribers open tcm page
        </button>
      </header>
    </div>
  );
}

let subscribeToWebPush = () => {
  navigator.serviceWorker.ready.then(async (register) => {
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    await fetch("https://dev.deepfuture.com.my/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json",
      },
    });
  });
};

let sendBroadcast = async ({
  title = "Broadcast to all",
  body = "Opening main page",
  url = "https://dev-dfecomm.netlify.app/",
  action = "open_url",
}) => {
  await fetch("https://dev.deepfuture.com.my/broadcast", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title,
      body,
      url,
      action,
    }),
  });
};

let notifyMe = () => {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    return alert("This browser does not support desktop notification");
  }

  // Otherwise, we need to ask the user for permission
  if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        let notification = new Notification("Thanks for giving permission!");
        notification.addEventListener("click", () => {
          console.log("Hi there click listener");
        });
      }
    });
  }

  console.log(Notification.permission);
  if (Notification.permission === "denied") {
    // Cant request again.. already blocked
    Notification.requestPermission();
    // Alternative is to ask user enable
    alert("Please enable your notification");
  }
};

function urlBase64ToUint8Array(base64String: any) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default App;
