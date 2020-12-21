import React from "react";
import "./App.css";

import { QueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";

import CollapsibleTable from "./components/Table";
//import ValidationsListShow from './components/DataComponent';

const queryCache = new QueryCache();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CollapsibleTable />
      </header>
    </div>
  );
}

export default App;
