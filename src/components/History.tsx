import * as React from "react";
import * as queryString from "querystring";
import {ParsedUrlQuery} from "querystring";
import {getHistoryList} from "../utils/LocalStore";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";

let speed = 1;
let count = 0;

const startPlay = (setPr: (value: (((prevState: string) => string) | string)) => void, setData: (value: (((prevState: string) => string) | string)) => void, historyData: any) => {
    setInterval(function () {
        moveNext(setData, setPr, historyData)
    }, 300);
}

function moveNext(setData: (value: (((prevState: string) => string) | string)) => void, setPr: (value: (((prevState: string) => string) | string)) => void, historyData: any){
    setData(historyData[count]);
    count = count + speed;
    count = count >= historyData.length ? 0 : count;
    setPr( `${count / historyData.length * 100}%` );
}

export const HistoryComponent = () => {

    const [pr, setPr] = useState("0%")
    const [data, setData] = useState("");

    const query: ParsedUrlQuery = queryString.decode(location.search, "?", "=");
    const sessionId = query.sessionId;
    const historyData = getHistoryList(sessionId);

    useEffect( () => {
        startPlay(setPr, setData, historyData)
    }, []);

    return (
        <div className="history">
            <div className="code-data ">
                {data}
            </div>
            <div className="panel">
                <div className="background">
                    <div className="btns">
                        <FontAwesomeIcon color="#424350" size="lg" icon={icons.faFastBackward} onClick={()=>{
                            speed -= 1;
                            if (speed < 0) {
                                speed = 0;
                            }
                        }}/>
                        <FontAwesomeIcon color="#424350" size="lg" icon={icons.faPlay} onClick={()=>{
                            speed = 1;
                        }}/>
                        <FontAwesomeIcon color="#424350" size="lg" icon={icons.faPause} onClick={()=>{
                            speed = 0;
                        }}/>
                        <FontAwesomeIcon color="#424350" size="lg" icon={icons.faFastForward} onClick={()=>{
                            speed += 1;
                        }}/>
                    </div>
                    <div className="slider">
                        <div className="slider-background">
                        </div>
                        <div className="slider-foreground" style={{marginLeft: pr}}>
                        </div>
                    </div>
                    <div className="counter">
                        <span>
                        {`${count} / ${historyData.length}`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
