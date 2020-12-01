import * as React from "react";
import {useCallback, useState} from "react";
import {Button, FormControl, InputGroup, Modal} from "react-bootstrap";
import Peer from "peerjs";

export const JoinSession = (props) => {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const createSession = () => {
        const peer = new Peer('synamedia-spj-sample-3');
        peer.on('connection', connection => {
            props.setConnection(connection);
            // console.log("Connection called");
            // connection.on("data", data => console.log("Data from peer is ", data))
        });
        peer.on('open', function(id) {
            console.log('My peer ID is: ' + id);
        });

        handleClose();
    };

    const joinSession = () => {
        const peer = new Peer();
        peer.on('open', function(id) {
            const connection = peer.connect('synamedia-spj-sample-3');
            props.setConnection(connection);
            console.log('My peer ID is: ' + id);
            // connection.on('open', () => {
            //     console.log("Connection opened");
            //     connection.send('hi!');
            // });
            // connection.on("data", data => console.log(data));
        });
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
