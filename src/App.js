import React, { Component } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import AppNav from './components/AppNav';
import AsyncDashboard from './components/AsyncDashboard';
import SyncDashboard from './components/SyncDashboard';
import axios from 'axios';

class App extends Component {

  state = {
    navItems: [
    {
      "label": "Async",
      "id": "async",
      "icon": "line-chart"
    }, 
    {
      "label": "Sync",
      "id": "sync",
      "icon": "book"
    }]
  }

  render() {
    const { navItems } = this.state;
    return (
      <div className="App">
        <px-branding-bar />

        {/* AppNav */}
        {/* <div style={{display: 'flex'}}>
          <AppNav items={navItems}/>
        </div> */}

        <Switch>
          <Route exact path="/async" component={AsyncDashboard} />
          <Route exact path="/sync" component={SyncDashboard} />
          <Route path="/" render={() => {
            return <Redirect to="/async" />
          }}/>
        </Switch>
      </div>
    );
  }
}

export default App;
