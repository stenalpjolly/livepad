import * as React from "react";
import {hot} from "react-hot-loader";
import "./../assets/scss/App.scss";
import { UnControlled as CodeMirror} from "react-codemirror2";

require('codemirror/mode/javascript/javascript');

class App extends React.Component<Record<string, unknown>, undefined> {
    options: any = {
        mode: 'javascript',
        theme: 'ayu-mirage',
        lineNumbers: true
    };
    state: any = {};
    componentDidMount() {
        if (typeof(Storage) !== "undefined") {
            // Retrieve
            this.setState({
                value: localStorage.getItem("content")
            })
        }
    }

    public render() {
        return (
            <CodeMirror
                value={this.state.value}
                options={this.options}
                onChange={(editor, data, value) => {
                    console.log(value)
                    localStorage.setItem("content", value);
                }}/>
        );
    }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
