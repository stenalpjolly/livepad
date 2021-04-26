import * as React from "react";
import {useEffect, useState} from "react";
import * as queryString from "querystring";
import {ParsedUrlQuery} from "querystring";
import {getHistoryList} from "../utils/LocalStore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay, faPause, faFastBackward, faFastForward} from "@fortawesome/free-solid-svg-icons";

let currentSpeed = 1;
let count = 0;
let historyData: any;

const startPlay = (setPr: (value: (((prevState: string) => string) | string)) => void, setData: (value: (((prevState: string) => string) | string)) => void) => {
    setInterval(function () {
        moveNext(setData, setPr, historyData, currentSpeed)
    }, 350);
}

function moveNext(setData: (value: (((prevState: string) => string) | string)) => void, setPr: (value: (((prevState: string) => string) | string)) => void, historyData: any, newSpeed: any){
    let newData = historyData[count].split("\n")
        .map((data,index) => {
            data = data.replace(/\s/g, "&nbsp;")
            return `<div class="font-1-rem align-content-center"><span class="line-number">${index}&nbsp;&nbsp;</span><span>${data}</span></div>`
        })
        .join("")
    setData(newData);
    count = count + newSpeed;
    if (count < 0 || count >= historyData.length) {
        count = 0;
    }
    setPr( `${count / (historyData.length - 1) * 100}%` );
}

export const HistoryComponent = () => {

    const [marginPercentage, setMarginPercentage] = useState("0%")
    const [data, setData] = useState("");

    const query: ParsedUrlQuery = queryString.decode(location.search, "?", "=");
    const sessionId = query.sessionId;
    historyData = getHistoryList(sessionId);

    useEffect( () => {
        startPlay(setMarginPercentage, setData)
    }, []);

    return (
        <div className="history">
            <div className="container code-data ">
                <div dangerouslySetInnerHTML={{__html: data}}/>
            </div>
            <div className="panel">
                <div className="background">
                    <div className="btns">
                        <FontAwesomeIcon color="#424350" size="lg" icon={faFastBackward} onClick={()=>{
                            currentSpeed = 0;
                            moveNext(setData, setMarginPercentage, historyData, -1);
                        }}/>
                        <FontAwesomeIcon color="#424350" size="lg" icon={faPlay} onClick={()=>{
                            currentSpeed = 1;
                        }}/>
                        <FontAwesomeIcon color="#424350" size="lg" icon={faPause} onClick={()=>{
                            currentSpeed = 0;
                        }}/>
                        <FontAwesomeIcon color="#424350" size="lg" icon={faFastForward} onClick={()=>{
                            currentSpeed = 0;
                            moveNext(setData, setMarginPercentage, historyData, 1);
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
