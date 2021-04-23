import * as React from "react";
import {Button, Nav, Navbar} from "react-bootstrap";

const getButton = (props: { userList: string[] }) => {
    const buttons = [];
    for (let index = 0; props.userList && index < props.userList.length; index++) {
      buttons.push(
          <Button
              key={index}
              size="sm"
              variant="outline-info"
              disabled
              className="pull-left"
              text-align="right"
          >
            {props.userList[index]}
          </Button>,
      );
      buttons.push(<>&nbsp;</>);
    }
    return buttons;
};

export const StatusBar = (props: { userList: string[] }): JSX.Element => {
    let navbar: JSX.Element = <></>;
    navbar = (
        <>
            <Navbar className="fixedBar" bg="dark" fixed="bottom">
                {" "}
                {/*Bootstrap*/}
                <Nav className="mr-auto right30 navbar-nav">{getButton(props)}</Nav>
            </Navbar>
        </>
    );
    return navbar;
};
