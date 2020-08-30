import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Request from "../request-test";
import AllIngredients from "./AllIngredients";
import AllUsers from "./AllUsers";

export default class Routes extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/" component={Request} />
          <Route
            exact
            path="/users/:userId/allingredients"
            component={AllIngredients}
          />
        </Switch>
      </div>
    );
  }
}