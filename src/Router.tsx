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
                <Route path="/history">
                    <History />
                </Route>
            </Switch>
        </Router>
    );
}

function History() {
    return (
        <div>
            <h2>About</h2>
        </div>
    );
}
