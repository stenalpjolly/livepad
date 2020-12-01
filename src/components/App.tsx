import * as React from "react";
import {hot} from "react-hot-loader";
import {UnControlled as CodeMirror} from "react-codemirror2";
import {JoinSession} from "./JoinSession";

import "./../assets/scss/App.scss";
import {useEffect, useState} from "react";

require('codemirror/mode/javascript/javascript');

function App(){
    const [value, setValue] = useState("");
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

    return (
        <>
            <JoinSession/>
            <CodeMirror
                value={value}
                options={options}
                onChange={(editor, data, value) => {
                    localStorage.setItem("content", value);
                }}>

            </CodeMirror>
        </>
    );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
