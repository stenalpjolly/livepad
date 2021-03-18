import * as React from "react";
import { useState } from "react";
import {Alert, Button, FormControl, InputGroup, Modal} from "react-bootstrap";
import * as queryString from "querystring";
import { ParsedUrlQuery } from "querystring";
import { Session } from "../utils/Session";

export const JoinSession = (props: {
  setConnection: (sessionInfo: Session.Info) => void;
}): JSX.Element => {
  const [show, setShow] = useState(true);
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
      props.setConnection(session);
      setShowInfo(true);
    }
  };

  const copyToClipboard = str => {
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

  const handleEnter = (target) =>{
    if (target && target.code === "Enter") {
      if (query.sessionId) {
        joinSession();
      } else {
        createSession();
      }
    }
  }

  const getButton = () => {
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
  return (
    <>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup id="username" className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl defaultValue={storedInfo.userName} onKeyDown={handleEnter}/>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>{getButton()}</Modal.Footer>
      </Modal>
      <Modal show={showInfo} onHide={() => {
        setShowInfo(false)
      }}>
        <Modal.Header>
          <Modal.Title>URL copied to clipboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant='info'>
            {newUrl}
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={()=>{
            setShowInfo(false)
          }}>Share</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
