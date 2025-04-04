import * as React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import App from "./components/App";

export default function RouterComponent() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <App />
                </Route>
            </Switch>
        </Router>
    );
}
