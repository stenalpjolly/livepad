import * as React from "react";
import {Button, Nav, Navbar} from "react-bootstrap";

const getButton = (props: { userList: User[] }) => {
    const buttons = [];
    for (let index = 0; props.userList && index < props.userList.length; index++) {
        const {color, name} = props.userList[index];
        const UserCss = {
            color: color,
            borderColor: color
        }
        buttons.push(
          <Button
              key={index}
              size="sm"
              variant="outline-info"
              disabled
              style={UserCss}
              className="pull-left"
              text-align="right"
          >
            {name}
          </Button>,
      );
      buttons.push(<>&nbsp;</>);
    }
    return buttons;
};

export const StatusBar = (props: { userList: User[] }): JSX.Element => {
    let navbar: JSX.Element;
    navbar = (
        <>
            <Navbar className="fixedBar" bg="dark" fixed="bottom">
                {" "}
                <Nav className="mr-auto right30 navbar-nav">{getButton(props)}</Nav>
            </Navbar>
        </>
    );
    return navbar;
};
