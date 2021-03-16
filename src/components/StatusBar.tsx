import * as React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import {EvalModal} from "./EvalModal";

export const StatusBar = (props: { userName: string[] }): JSX.Element => {
  let navbar: JSX.Element = <></>;
  if (props.userName && props.userName.length > 0) {
    const getButton = () => {
      const buttons = [];
      for (let index = 0; index < props.userName.length; index++) {
        buttons.push(
          <Button
            key={index}
            size="sm"
            variant="outline-info"
            disabled
            className="pull-left"
            text-align="right"
          >
            {props.userName[index]}
          </Button>,
        );
        buttons.push(<>&nbsp;</>);
      }
      return buttons;
    };
    navbar = (
      <>
        <Navbar className="fixedBar" bg="dark" fixed="bottom">
          {" "}
          {/*Bootstrap*/}
          <Nav className="mr-auto right30 navbar-nav">{getButton()}</Nav>
          <Nav className="ml-auto navbar-nav">
            <Button
                key="evalModelBtn"
                size="sm"
                variant="outline-info"
                disabled
                className="pull-right"
                text-align="right"
            >Eval<EvalModal/></Button>
          </Nav>
        </Navbar>
      </>
    );
  }
  return navbar;
};
