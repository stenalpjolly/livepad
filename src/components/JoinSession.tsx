import * as React from "react";
import {useState} from "react";
import {Button, FormControl, InputGroup, Modal} from "react-bootstrap";
import Peer from "peerjs";

export const JoinSession = (props) => {
    const [show, setShow] = useState(true);

    const handleClose = () => {
        const userName = document.getElementById("username").getElementsByTagName("input")[0].value;
        if (userName) {
            setShow(false);
            props.setName(userName);
            return true;
        }
        return false;
    }
    const createSession = () => {
        if (handleClose()) {
            const peer = new Peer('synamedia-spj-sample-3');
            peer.on('connection', connection => {
                props.setConnection(connection);
            });
            peer.on('open', function(id) {
                console.log('My peer ID is: ' + id);
            });
        }
    };

    const joinSession = () => {
        if(handleClose()){
            const peer = new Peer();
            peer.on('open', function(id) {
                const connection = peer.connect('synamedia-spj-sample-3');
                props.setConnection(connection);
                console.log('My peer ID is: ' + id);
            });
        }
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
                            <InputGroup.Text >Name</InputGroup.Text>
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
