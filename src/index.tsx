import * as React from "react";
import { render } from "react-dom";
import App from "./components/App";

const rootEl = document.getElementById("root");

declare global {
    interface User {
        name: string,
        color: string
    }
}

render(<App />, rootEl);
