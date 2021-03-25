import "./../assets/scss/App.scss";

import * as React from "react";
import { hot } from "react-hot-loader";
import { JoinSession } from "./JoinSession";
import { useCallback, useState } from "react";
import { StatusBar } from "./StatusBar";
import * as CodeMirror from "codemirror";
import firebase from "firebase";
import { Session } from "../utils/Session";
import { EditorConfiguration } from "codemirror";
import {Toast} from "react-bootstrap";

require("firebase/firebase-database");

global.CodeMirror = CodeMirror;
const Firepad = require("firepad");

require("codemirror/mode/javascript/javascript");

function App() {
  const [users, setUserName] = useState([]);
  const [showToast, setShowToast] = useState(false);

  let editor: CodeMirror.Editor;

  const firebaseConfig = {
    apiKey: "AIzaSyCz-v0dUj8n0IEBaW7Y_jcTdMK0Bl5aEn4",
    authDomain: "livepad-c8b42.firebaseapp.com",
    databaseURL: "https://livepad-c8b42.firebaseio.com",
    projectId: "livepad-c8b42",
    storageBucket: "livepad-c8b42.appspot.com",
    messagingSenderId: "955572407056",
    appId: "1:955572407056:web:f3ab18032182fc8d4f3395",
    measurementId: "G-S4DSYBQCC6",
  };

  const options: EditorConfiguration = {
    mode: "javascript",
    theme: "ayu-mirage",
    lineWrapping: true,
    lineNumbers: true,
  };

  const setNewConnection = useCallback((sessionInfo: Session.Info) => {
    users.push(sessionInfo.userName);
    setUserName([...users]);

    const app = firebase.initializeApp(firebaseConfig);

    // Get Firebase Database reference.
    const firepadRef = firebase.database(app).ref(`sessions/${sessionInfo.roomId}`);

    firepadRef.on("value", (snapshot) => {
      const userList = snapshot.val()?.users;
      const newUserList = [];
      for (const user in userList) {
        if (userList.hasOwnProperty(user)) {
          newUserList.push(user);
        }
      }
      setUserName(newUserList);
    });

    if (sessionInfo.sessionType === Session.Type.CANDIDATE) {
      options.mode = "";
    }
    editor = CodeMirror(document.getElementById("editor"), options);

    // Create Firepad
    const firepad = Firepad.fromCodeMirror(firepadRef, editor, {
      userId: users[0],
    });

    firepad.on("cursor", function (params) {
      const cursor = document.querySelector(`[data-clientid="${params}"]`);
      if (cursor) {
        cursor.innerHTML = `<span>${params}</span>`;
        if (!isInViewport(cursor)) {
          setShowToast(true)
        } else {
          setShowToast(false)
        }
      }
    });
  }, []);

  return (
    <>
      <JoinSession setConnection={setNewConnection}  />
      <Toast className={'toast-bottom pulseit alert-primary'} show={showToast}>
        <Toast.Body>Scroll to see more!</Toast.Body>
      </Toast>
      <div id={"editor"} className={"react-codemirror2"} />
      <StatusBar userName={users} />
    </>
  );
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 50 &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
