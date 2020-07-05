import React from "react";
import { HashRouter } from "react-router-dom";
import { Current, CurrentProvider } from "./../shared/contexts/current";
import View from "./View";

const App = Current((props) => {
  return <View />;
});

export default () => {
  return (
    <div className="App">
      <HashRouter>
        <CurrentProvider>
          <App />
        </CurrentProvider>
      </HashRouter>
    </div>
  );
};
