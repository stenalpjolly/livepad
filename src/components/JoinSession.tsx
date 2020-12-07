import * as React from "react";
import { useState } from "react";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";
import * as queryString from "querystring";
import { ParsedUrlQuery } from "querystring";
import { Session } from "../utils/Session";

export const JoinSession = (props: {
  setConnection: (sessionInfo: Session.Info) => void;
}): JSX.Element => {
  const [show, setShow] = useState(true);
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
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?sessionId=${sessionId}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
      }
      const session: Session.Info = {
        roomId: sessionId?.toString(),
        userName: username,
        sessionType: Session.Type.HOST,
      };
      localStorage.setItem(session.roomId, JSON.stringify(session));
      props.setConnection(session);
    }
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
            <FormControl defaultValue={storedInfo.userName}/>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>{getButton()}</Modal.Footer>
      </Modal>
    </>
  );
};
