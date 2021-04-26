import * as React from "react";
import { render } from "react-dom";
import Router from "./Router";

const rootEl = document.getElementById("root");

declare global {
    interface User {
        name: string,
        color: string
    }
}

render(<Router />, rootEl);
