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
    state: any;
    value: any;
    public render() {
        return (
            <CodeMirror
                value={this.value}
                options={this.options}
                onChange={(editor, data, value) => {
                    console.log(editor, data)
                }}/>
        );
    }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
