import * as React from "react";
import { useState } from "react";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";
import * as queryString from "querystring";
import { ParsedUrlQuery } from "querystring";

export const JoinSession = (props: {
  setConnection: (roomId: string) => void;
  setName: (usrName) => void;
}) => {
  const [show, setShow] = useState(true);
  const query: ParsedUrlQuery = queryString.decode(location.search, "?", "=");

  const handleClose = () => {
    const userName = document
      .getElementById("username")
      .getElementsByTagName("input")[0].value;
    if (userName) {
      setShow(false);
      props.setName(userName);
      return true;
    }
    return false;
  };
  const createSession = () => {
    if (handleClose()) {
      const sessionId = new Date().getTime();
      if (history.pushState) {
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?sessionId=${sessionId}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
      }
      props.setConnection(sessionId?.toString());
    }
  };

  const joinSession = () => {
    if (handleClose()) {
      props.setConnection(query.sessionId?.toString());
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
            <FormControl />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>{getButton()}</Modal.Footer>
      </Modal>
    </>
  );
};
