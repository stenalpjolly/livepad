import * as React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import App from "./components/App";
import {HistoryComponent} from "./components/History"

export default function RouterComponent() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <App />
                </Route>
                <Route path="/history">
                    <HistoryComponent />
                </Route>
            </Switch>
        </Router>
    );
}
