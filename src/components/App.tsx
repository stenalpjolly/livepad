import "./../assets/scss/App.scss";

import * as React from "react";
import {hot} from "react-hot-loader";
import {JoinSession} from "./JoinSession";
import {useCallback, useEffect, useState} from "react";
import {StatusBar} from "./StatusBar";
import * as CodeMirror from 'codemirror';
import firebase from 'firebase';
import {Button} from "react-bootstrap";

require('firebase/firebase-database');

global.CodeMirror = CodeMirror;
const Firepad = require('firepad')

require('codemirror/mode/javascript/javascript');

function App() {
    const [users, setUserName] = useState([]);

    let editor: CodeMirror.Editor;
    let firepadEditor: any;

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

    const options: any = {
        mode: 'javascript',
        theme: 'ayu-mirage',
        lineWrapping: true,
        lineNumbers: true
    };

    useEffect(() => {
    });

    let setNewConnection = useCallback((roomId: number) => {

        const app = firebase.initializeApp(firebaseConfig);

        // Get Firebase Database reference.
        const firepadRef = firebase.database(app).ref(roomId.toString());

        firepadRef.on("value", (snapshot) => {
            const userList = snapshot.val()?.users;
            const newUserList = [];
            for (let user in userList) {
                newUserList.push(user);
            }
            setUserName(newUserList);
        });

        // Create CodeMirror (with lineWrapping on).
        editor = CodeMirror(document.getElementById('editor'), options);
        global.CodeMirror = CodeMirror;

        // Create Firepad (with rich text toolbar and shortcuts enabled).
        firepadEditor = Firepad.fromCodeMirror(firepadRef, editor, {
            userId: users[0]
        });
    }, []);

    return (
        <>
            <JoinSession setConnection={setNewConnection} setName={(usrName) => {
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
