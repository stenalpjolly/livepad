import * as React from "react"
import {Button, Nav, Navbar} from "react-bootstrap"

export const StatusBar = (props) => {
    let navbar: JSX.Element = <></>;
    if (props.userName && props.userName.length > 0) {
        let getButton = () => {
            let buttons = [];
            for (let index = 0; index < props.userName.length; index++) {
                buttons.push(<Button size="sm" variant="outline-info" disabled className="pull-left"
                                    text-align="right">{props.userName[index]}</Button>);
                buttons.push(<>&nbsp;</>);
            }
            return buttons;
        };
        navbar = <><Navbar className="fixedBar" bg="dark" fixed="bottom"> {/*Bootstrap*/}
            <Nav className="mr-auto right30 navbar-nav">
                {getButton()}
            </Nav>
        </Navbar></>;
    }
    return navbar;
}
