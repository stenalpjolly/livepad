import * as React from "react";
import {useEffect, useState} from "react";
import * as CodeMirror from "codemirror";
import * as queryString from "querystring";
import {ParsedUrlQuery} from "querystring";
import {getHistoryList} from "../utils/LocalStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay, faPause, faFastBackward, faFastForward} from "@fortawesome/free-solid-svg-icons";
import {EditorConfiguration} from "codemirror";

let currentSpeed = 1;
let count = 0;
let historyData: any;
let timer;
global.CodeMirror = CodeMirror;

let editor: CodeMirror.Editor;
const options: EditorConfiguration = {
    theme: "ayu-mirage",
    readOnly: "nocursor",
    lineWrapping: true,
    lineNumbers: true,
};

const startPlay = (setPr: (value: (((prevState: string) => string) | string)) => void) => {
    timer = setInterval(function () {
        moveNext(setPr, historyData, currentSpeed)
    }, 350);
}

function moveNext(setPr: (value: (((prevState: string) => string) | string)) => void, historyData: any, newSpeed: any) {
    if (newSpeed === 0) {
        return;
    }
    count = count + newSpeed;
    if (count < 0) {
        count = historyData.length + count;
    } else if (count >= historyData.length) {
        count = 0;
    }
    editor.setValue(historyData[count]);
    setPr( `${count / (historyData.length - 1) * 100}%` );
}

export const HistoryComponent = () => {
    const [marginPercentage, setMarginPercentage] = useState("0%")
    const query: ParsedUrlQuery = queryString.decode(location.search, "?", "=");
    const sessionId = query.sessionId;
    historyData = getHistoryList(sessionId);

    useEffect( () => {
        editor = CodeMirror(document.getElementById("editor"), options);
        startPlay(setMarginPercentage);
        return () => {
            count = 0;
            currentSpeed = 1;
            clearInterval(timer);
        }
    }, []);

    return (
        <div className="firepad history">
            <div id={"editor"} className={"history"} />
            <div className="panel">
                <div className="background">
                    <div className="btns">
                        <FontAwesomeIcon color="#424350" size="lg" icon={faFastBackward} onClick={()=>{
                            currentSpeed = 0;
                            moveNext(setMarginPercentage, historyData, -1);
                        }}/>
                        <FontAwesomeIcon color="#424350" size="lg" icon={faPlay} onClick={()=>{
                            currentSpeed = 1;
                        }}/>
                        <FontAwesomeIcon color="#424350" size="lg" icon={faPause} onClick={()=>{
                            currentSpeed = 0;
                        }}/>
                        <FontAwesomeIcon color="#424350" size="lg" icon={faFastForward} onClick={()=>{
                            currentSpeed = 0;
                            moveNext(setMarginPercentage, historyData, 1);
                        }}/>
                    </div>
                    <div className="slider">
                        <div className="slider-background">
                        </div>
                        <div className="slider-foreground" style={{marginLeft: marginPercentage}}>
                        </div>
                    </div>
                    <div className="counter">
                        <span>
                        {`${count} / ${historyData.length - 1}`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
