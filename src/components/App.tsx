import "./../assets/scss/App.scss";

import * as React from "react";
import {hot} from "react-hot-loader";
import {JoinSession} from "./JoinSession";
import {useEffect, useState} from "react";
import {StatusBar} from "./StatusBar";
import * as CodeMirror from 'codemirror';
import firebase from 'firebase';
require('firebase/firebase-database');

global.CodeMirror = CodeMirror;
const Firepad = require('firepad')

require('codemirror/mode/javascript/javascript');

function App(){
    const [value, setValue] = useState("");
    const [users, setUserName] = useState([]);

    let editor: CodeMirror.Editor;

    const options: any = {
        mode: 'javascript',
        theme: 'ayu-mirage',
        lineWrapping: true,
        lineNumbers: true
    };

    useEffect(() => {
    });

    let setNewConnection = (roomId: number) => {
        const firebaseConfig = {
            apiKey: "AIzaSyCz-v0dUj8n0IEBaW7Y_jcTdMK0Bl5aEn4",
            authDomain: "livepad-c8b42.firebaseapp.com",
            databaseURL: "https://livepad-c8b42.firebaseio.com",
            projectId: "livepad-c8b42",
            storageBucket: "livepad-c8b42.appspot.com",
            messagingSenderId: "955572407056",
            appId: "1:955572407056:web:f3ab18032182fc8d4f3395",
            measurementId: "G-S4DSYBQCC6"
        };

        let app = firebase.initializeApp(firebaseConfig);

        // Get Firebase Database reference.
        let firepadRef = firebase.database(app).ref(roomId.toString());

        // Create CodeMirror (with lineWrapping on).
        editor = CodeMirror(document.getElementById('editor'), options);
        global.CodeMirror = CodeMirror;

        // Create Firepad (with rich text toolbar and shortcuts enabled).
        let firepad = Firepad.fromCodeMirror(firepadRef, editor, {});
    }

    return (
        <>
            <JoinSession setConnection={setNewConnection} setName={(usrName)=>{
                users.push(usrName);
                setUserName([...users]);
            }}/>
            <div id={"editor"} className={'react-codemirror2'}/>
            <StatusBar userName={users}/>
        </>
    );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
