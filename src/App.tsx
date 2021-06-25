import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={notifyMe}>Ask for permission</button>
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

export default App;
