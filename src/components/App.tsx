import "./../assets/scss/App.scss";

import * as React from "react";
import Peer from "peerjs";
import {UnControlled as CodeMirror, ICodeMirror } from "react-codemirror2";
import {hot} from "react-hot-loader";
import {JoinSession} from "./JoinSession";
import {useEffect, useState} from "react";
import {StatusBar} from "./StatusBar";
import * as codemirror from 'codemirror';
import * as CodeMirrorCollabExt from '@convergencelabs/codemirror-collab-ext'

require('codemirror/mode/javascript/javascript');

function App(){
    const [value, setValue] = useState("");
    const [users, setUserName] = useState([]);

    let editor: codemirror.Editor;

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
            // setValue(localStorage.getItem('content'));
        }
    });

    let setNewConnection = (connection: Peer.DataConnection) => {
        if(connection){
            const sendData = (param: { type: string; value: { index?: number; text?: string; length?: number ;username?:string} }) => {
                let dataInfo = {
                    who: connection.peer,
                    type: param.type,
                    value: param.value
                }
                console.log("Send", dataInfo);
                connection.send(JSON.stringify(dataInfo));
            };

            connection.on("open", () => {
                sendData({
                    type: "NewConnection",
                    value: {
                        username: users[0]
                    }
                });
            });

            const remoteCursorManager = new CodeMirrorCollabExt.RemoteCursorManager({
                editor: editor,
                tooltips: true,
                tooltipDuration: 2
            });

            const cursor = remoteCursorManager.addCursor("newUser", "#"+Math.floor(Math.random()*16777215).toString(16), users[0]);

            const contentManager = new CodeMirrorCollabExt.EditorContentManager({
                editor: editor,
                onInsert(index, text) {
                    sendData({
                        type: "Insert",
                        value:{
                            index,
                            text
                        }
                    })
                    // console.log("Insert", index, text);
                },
                onReplace(index, length, text) {
                    sendData({
                        type: "Replace",
                        value:{
                            index,
                            text,
                            length
                        }
                    })
                    // console.log("Replace", index, length, text);
                },
                onDelete(index, length) {
                    sendData({
                        type: "Delete",
                        value:{
                            index,
                            length
                        }
                    })
                    // console.log("Delete", index, length);
                }
            });

            // Show the cursor
            cursor.show();

            connection.on("data", data => {
                const dataInfo = JSON.parse(data);
                console.log("Recieve" , dataInfo);
                const value = dataInfo.value;
                cursor.setIndex(value.index || 0)
                switch (dataInfo.type){
                    case "Insert":
                        contentManager.insert(value.index, value.text);
                        break;
                    case "Delete":
                        contentManager.delete(value.index, value.length);
                        break;
                    case "Replace":
                        contentManager.replace(value.index, value.length, value.text);
                        break;
                    case "NewConnection":
                        users.push(value.username);
                        setUserName([...users]);
                }
            });
        }
    };

    return (
        <>
            <JoinSession setConnection={setNewConnection} setName={(usrName)=>{
                users.push(usrName);
                setUserName([...users]);
            }}/>
            <CodeMirror
                value={value}
                options={options}
                editorDidMount={cEditor => {
                    editor = cEditor;
                }}
            >
            </CodeMirror>
            <StatusBar userName={users}/>
        </>
    );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
