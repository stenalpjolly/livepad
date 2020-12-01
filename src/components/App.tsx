import * as React from "react";
import {hot} from "react-hot-loader";
import {UnControlled as CodeMirror} from "react-codemirror2";
import {JoinSession} from "./JoinSession";

import "./../assets/scss/App.scss";
import {useEffect, useState} from "react";
import Peer from "peerjs";

require('codemirror/mode/javascript/javascript');

function App(){
    const [value, setValue] = useState("");
    const [conn, setConn] = useState<Peer.DataConnection>();
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
        // console.log("Connection set")
        if(connection){
            setConn(connection);
            // console.log("Connection set")
            connection.on("data", data => {
                console.log(data);
                localStorage.setItem("content", value);
                setValue(data);
            });
        }
    };

    return (
        <>
            <JoinSession setConnection={setNewConnection}/>
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
        </>
    );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
