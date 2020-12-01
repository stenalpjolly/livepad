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

    if (conn && conn.open) {
        conn.on("data", data => {
            console.log(JSON.parse(data));
        });
    }

    return (
        <>
            <JoinSession setConnection={setConn}/>
            <CodeMirror
                value={value}
                options={options}
                onChange={(editor, data, value) => {
                    localStorage.setItem("content", value);
                    if (conn && conn.open) {
                        conn.send(JSON.stringify(data));
                    }
                }}>
            </CodeMirror>
        </>
    );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
