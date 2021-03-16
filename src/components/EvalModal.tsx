import * as React from "react";
import {
    DropdownButton,
    FormControl,
    InputGroup,
    Modal,
    Dropdown,
    ListGroup,
    Table,
    ModalBody,
    ToggleButton, ToggleButtonGroup, Button
} from "react-bootstrap";
import {useState} from "react";
import DatePicker from "react-datepicker";
import {DownloadPdf} from './GeneratePdf'


export const EvalModal = (): JSX.Element => {
    const [startDate, setStartDate] = useState(new Date());

    let evalModelElement: JSX.Element =
        <Modal dialogClassName="modal-custom-w" centered show="true">
            <Modal.Header closeButton>
                <Modal.Title>Synamedia Evaluation Form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup id="candidateName" className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Candidate Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl/>
                    <DropdownButton title="Position" className="ml-3">
                        <Dropdown.Item eventKey="1" href="#">D-P3</Dropdown.Item>
                        <Dropdown.Item eventKey="2" href="#">C-P2</Dropdown.Item>
                        <Dropdown.Item eventKey="3" href="#">B-P1</Dropdown.Item>
                        <Dropdown.Item eventKey="4" href="#">B P1 Entry</Dropdown.Item>
                    </DropdownButton>
                    <FormControl className="ml-1"/>
                </InputGroup>
                <InputGroup id="position" className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Interviewer’s Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl/>
                    <InputGroup.Prepend className="ml-3">
                        <InputGroup.Text>Date</InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker className='form-control' selected={startDate} onChange={date => setStartDate(date)}/>
                </InputGroup>
                <InputGroup>
                    <Table striped bordered>
                        <tbody>
                        <tr>
                            <td>
                                <b>Technical capability</b>
                                <p>Assess experience of the candidate in their core technical knowledge</p>
                            </td>
                            <td>
                                <select id="inputState" className="form-control mt-2">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Logical reasoning:</b>
                                <p>Assess candidate’s logical thinking.</p>
                            </td>
                            <td>
                                <select id="inputState" className="form-control mt-2">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Analytical thinking:</b>
                                <p>Assess candidate’s responsiveness to change, tolerance for ambiguity.</p>
                            </td>
                            <td>
                                <select id="inputState" className="form-control mt-2">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Problem Solving:</b>
                                <p>Consider the candidate’s problem solving</p>
                            </td>
                            <td>
                                <select id="inputState" className="form-control mt-2">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Out of box thinking:</b>
                                <p>Consider the candidate’s innovative thought process</p>
                            </td>
                            <td>
                                <select id="inputState" className="form-control mt-2">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Interpersonal/Communication Skills:</b>
                                <p>Assess ability to express ideas and thoughts clearly.</p>
                            </td>
                            <td>
                                <select id="inputState" className="form-control mt-2">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Overall Evaluation:</b>
                                <p>Please add appropriate comments below:</p>
                            </td>
                            <td>
                                <select id="inputState" className="form-control mt-2">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </InputGroup>
                <InputGroup id="candidateName" className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Remarks</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl/>
                </InputGroup>
                <InputGroup className='float-right'>
                    <ToggleButtonGroup className='' size='lg' type="radio" name="options" defaultValue={1}>
                        <ToggleButton value={1}>On Hold</ToggleButton>
                        <ToggleButton value={2}>Proceed to Next</ToggleButton>
                        <ToggleButton value={3}>Reject</ToggleButton>
                    </ToggleButtonGroup>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    key='download'
                    className="pull-left"
                    text-align="right">
                    <DownloadPdf />
                </Button>
            </Modal.Footer>
        </Modal>;

    return evalModelElement;
}
