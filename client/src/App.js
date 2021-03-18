import React from "react";
import { Home } from "./components/Home";
import { BrowserRouter, Route, Switch } from "react-router-dom";


export const App = () => (
  <h1>
    <main>
      <div>
        <BrowserRouter>
          <Switch>
              <Home/>
            {/* <Route path="" component={Home} /> */}
          </Switch>
        </BrowserRouter>
      </div>
    </main>
  </h1>
);
