import * as React from "react";
import {useState} from "react";
import {Alert, Button, FormControl, InputGroup, Modal} from "react-bootstrap";
import * as queryString from "querystring";
import {ParsedUrlQuery} from "querystring";
import {Session} from "../utils/Session";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHistory,faPlayCircle,faCopy,faShareAlt} from "@fortawesome/free-solid-svg-icons";
import {createSessionSnapshot, getAllHistory, getHistoryCount} from "../utils/LocalStore"

export const JoinSession = (props: {
  setConnection: (sessionInfo: Session.Info) => void;
}): JSX.Element => {
  const [show, setShow] = useState(true);
  const [userSessionName, setUserSessionName] = useState("world");
  const [showInfo, setShowInfo] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const query: ParsedUrlQuery = queryString.decode(location.search, "?", "=");
  const storedInfo = JSON.parse(localStorage.getItem(query.sessionId?.toString()) || "{}");

  const handleClose = (): string => {
    const userName = document
        .getElementById("username")
        .getElementsByTagName("input")[0].value;
    if (userName) {
      setShow(false);
      return userName;
    }
    return null;
  };

  const createSession = () => {
    const username = handleClose();
    if (username) {
      const sessionId = new Date().getTime();
      if (history.pushState) {
        const tempURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}?sessionId=${sessionId}`;
        copyToClipboard(tempURL);
        window.history.pushState({ path: tempURL }, "", tempURL);
        setNewUrl(tempURL);
      }
      const session: Session.Info = {
        roomId: sessionId?.toString(),
        userName: username,
        sessionType: Session.Type.HOST,
      };
      localStorage.setItem(session.roomId, JSON.stringify(session));
      createSessionSnapshot(session.roomId)
      props.setConnection(session);
      setShowInfo(true);
    }
  };

  const copyToClipboard = str => {
    console.log(str);
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const joinSession = () => {
    const username = handleClose();
    if (username) {
      const session: Session.Info = {
        roomId: query.sessionId?.toString(),
        userName: username,
        sessionType: storedInfo?.sessionType ?? Session.Type.CANDIDATE,
      };
      localStorage.setItem(session.roomId, JSON.stringify(session));
      props.setConnection(session);
    }
  };

  const handleEnter = (event) => {
    if (event && event.code === "Enter") {
      if (query.sessionId) {
        joinSession();
      } else {
        createSession();
      }
    }
  }

  const handleUserNameChange = (event) => {
    const userName = event.target.value;
    setUserSessionName(userName||"world");
  }

  const sessionPrimaryButton = () => {
    let btn: JSX.Element = (
        <Button variant="primary" onClick={createSession}>
          Create Session
        </Button>
    );
    if (query.sessionId) {
      btn = (
          <Button variant="primary" onClick={joinSession}>
            Join Session
          </Button>
      );
    }
    return <>{btn}</>;
  };


  const getHistoryButton = () => {
    let btn: JSX.Element = (<></>);
    const historyInstanceCount = getHistoryCount();
    if (!query.sessionId && historyInstanceCount > 0) {
      btn = (<div className="font-1-rem">
        <FontAwesomeIcon color="#007bff" icon={faHistory}/>
        &nbsp;Recent Sessions
        {/*<Link to="/history?sessionId=1619368809894"> History</Link>*/}
      </div>)
    }
    return btn;
  };

  const getHistoryList = () => {
    const btn =  [];
    const allHistory = getAllHistory();

    if (!query.sessionId  && allHistory.length > 0) {
      btn.push(
          <div className="row history-list-title mt-1 rounded p-2">
            <div className="font-1-rem mb"><FontAwesomeIcon color="#007bff" icon={faHistory}/><span className="ml-1">Recent Sessions</span></div>
          </div>
      )
      const count = Math.min(allHistory.length, 5);
      for (let index = 0; index < count; index++) {
        const historySessionId = allHistory[index];
        let  newDate = new Date(0);
        newDate.setUTCMilliseconds(parseInt(historySessionId))
        btn.push(
            <div className="row history-list-row rounded p-2">
              <div className="col-1">
                <Link to={`/history?sessionId=${historySessionId}`}>
                  <FontAwesomeIcon color="#007bff" title="Play" className="fa-lg" icon={faPlayCircle}/>
                </Link>
              </div>
              <div className="col-10 font-1-rem session-title">
                {newDate.toLocaleString()}
              </div>
            </div>
        );
      }

    }
    return btn;
  };

  return (
      <>
        <Modal show={show}>
          <Modal.Header>
            <Modal.Title>Hello, {userSessionName}!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup id="username" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>Name</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl defaultValue={storedInfo.userName} onChange={handleUserNameChange} onKeyDown={handleEnter}/>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <div className="no-padding session-btn">
              {sessionPrimaryButton()}
            </div>
            <div className="container">
              <div className="no-padding">
                <div className="container no-padding">
                  {getHistoryList()}
                </div>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
        <Modal size="lg" show={showInfo} onHide={() => {
          setShowInfo(false)
        }}>
          <Modal.Header>
            <Modal.Title><FontAwesomeIcon color="#28a745" icon={faShareAlt} /> URL to join the session</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant='success'>
              <span className="col-10">{newUrl}</span> <FontAwesomeIcon role="button" title="Copy to clipboard" onClick={() => copyToClipboard(newUrl)} className="float-right" color="#28a745" icon={faCopy}/>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={()=>{
              setShowInfo(false)
            }}>Start Session</Button>
          </Modal.Footer>
        </Modal>
      </>
  );
};
