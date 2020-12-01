import * as React from "react"
import {Button, Nav, Navbar} from "react-bootstrap"

export const StatusBar = (props) => {
    let navbar: JSX.Element = <></>;
    if (props.userName) {
        navbar = <><Navbar className="fixedBar" bg="dark" fixed="bottom"> {/*Bootstrap*/}
            <Nav className="mr-auto right30 navbar-nav">
                <Button size="sm" variant="outline-info" disabled className="pull-left" text-align="right">{props.userName}</Button>
            </Nav>
        </Navbar></>;
    }
    return navbar;
}
