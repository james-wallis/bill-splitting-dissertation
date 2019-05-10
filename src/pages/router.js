import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './home.js';
import Create from './create.js';
import Join from './join.js';
import Group from './group.js';
import Logout from './logout.js';

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/join" component={Join} />
        <Route path="/create" component={Create} />
        <Route path="/group" component={Group} />
        <Route path="/logout" component={Logout} />
        <Route render={() => <Redirect to="/join" />} />
      </Switch>
    );
  }
}

export default Router;