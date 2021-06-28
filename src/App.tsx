import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const publicVapidKey =
  "BDxB08uFViF3YLCde8Rj__QifQ9jt8qrWsA1D_syqJE1wcgCt3yNnPPdg70aY8vCae0Sy9xdrtP9sXOTkqEOCiw";

function App() {
  const [icon, setIcon] = useState(
    "https://df-ecommerce.s3.amazonaws.com/UcQdNA7Aa"
  );
  const [image, setImage] = useState(
    "https://df-ecommerce.s3.amazonaws.com/frTudmhyd"
  );

  let subscribeToWebPush = () => {
    navigator.serviceWorker.ready.then(async (register) => {
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      console.log("subscription:", subscription);
      await fetch("https://dev.deepfuture.com.my/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json",
        },
      });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p></p>
        version 7
        <p>
          <span>icon</span>
          <input value={icon} onChange={(e) => setIcon(e.target.value)} />
        </p>
        <p>
          <span>image</span>
          <input value={image} onChange={(e) => setImage(e.target.value)} />
        </p>
        <p />
        <button onClick={notifyMe}>Ask for permission</button>
        <button onClick={subscribeToWebPush}>
          Subscribe this client to webpush ( no duplicates )
        </button>
        <button onClick={clearSubscriptions}>Clear subscriptions</button>
        <p />
        <button
          onClick={() => sendBroadcast({ icon, image, badge: "car128.png" })}
        >
          Send notification to open main page
        </button>
        <button
          onClick={() =>
            sendBroadcast({
              title: "中风--每10分钟1大马男人中招!",
              body: "中风是大马人的第三大杀手，它也是引发严重残疾的单一主要病因。",
              badge: "fruit128.png",
              icon: "https://df-ecommerce.s3.amazonaws.com/UcQdNA7Aa",
              image: "https://df-ecommerce.s3.amazonaws.com/ENhjjoUVH",
              url: "https://dev-dfecomm.netlify.app/ShopGen02/dftcm/blog/60d01f7676500a366fedc2e0",
            })
          }
        >
          Send notification of tcm blog
        </button>
        <p />
        <button
          onClick={() =>
            showNotification({
              body: "This is body",
              badge: icon,
              icon: icon,
              image: image,
            })
          }
        >
          Show local notification
        </button>
      </header>
    </div>
  );
}

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

let clearSubscriptions = () => {
  fetch("https://dev.deepfuture.com.my/clearSubscribers", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
};

let sendBroadcast = async ({
  title = "This is the title",
  body = "This is the body",
  icon = "https://df-ecommerce.s3.amazonaws.com/UcQdNA7Aa",
  image = "https://df-ecommerce.s3.amazonaws.com/frTudmhyd",
  badge = "logo192.png",
  url = "https://df-testing-cra.netlify.app/",
  ttl = 180, // seconds -how long a push message is retained by the push service, default is four weeks
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
      icon,
      badge,
      image,
      ttl,
      url,
      action,
    }),
  });
};

let showNotification = (options: NotificationOptions) => {
  console.log(options);
  navigator.serviceWorker.getRegistration().then((reg) => {
    reg?.showNotification("This is title", options);
  });
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
