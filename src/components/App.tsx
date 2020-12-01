import "./../assets/scss/App.scss";

import * as React from "react";
import Peer from "peerjs";
import {UnControlled as CodeMirror} from "react-codemirror2";
import {hot} from "react-hot-loader";
import {JoinSession} from "./JoinSession";
import {useEffect, useState} from "react";
import {StatusBar} from "./StatusBar";

require('codemirror/mode/javascript/javascript');

function App(){
    const [value, setValue] = useState("");
    const [conn, setConn] = useState<Peer.DataConnection>();
    const [userName, setUserName] = useState("");
    const options: any = {
        mode: 'javascript',
        theme: 'ayu-mirage',
        lineWrapping: true,
        lineNumbers: true
    };

    useEffect(() => {
        // Update the document title using the browser API
        if (typeof (Storage) !== "undefined") {
            // Retrieve
            setValue(localStorage.getItem('content'));
        }
    });

    let setNewConnection = function (connection: Peer.DataConnection) {
        if(connection){
            setConn(connection);
            connection.on("data", data => {
                console.log(data);
                localStorage.setItem("content", value);
                setValue(data);
            });
        }
    };

    return (
        <>
            <JoinSession setConnection={setNewConnection} setName={setUserName}/>
            <CodeMirror
                value={value}
                options={options}
                onChange={(editor, data, value) => {
                    localStorage.setItem("content", value);
                    console.log("Data send");
                    if (conn) {
                        console.log("Data send");
                        conn.send(value);
                    }
                }}>
            </CodeMirror>
            <StatusBar userName={userName}/>
        </>
    );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
