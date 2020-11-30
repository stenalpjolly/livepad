import * as React from "react";
import {useState} from "react";
import {Button, FormControl, InputGroup, Modal} from "react-bootstrap";

export const JoinSession = () => {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const createSession = () => {
        handleClose();
    };

    const joinSession = () => {
        handleClose();
    };

    return (
        <>
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>Session</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Name</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl/>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={createSession}>
                        Create Session
                    </Button>
                    <Button variant="primary" onClick={joinSession}>
                        Join Session
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
