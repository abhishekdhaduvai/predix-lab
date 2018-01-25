import React, { Component } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import AppNav from './components/AppNav';
import Dashboard1 from './components/Dashboard1';
import Dashboard2 from './components/Dashboard2';
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
          <Route exact path="/dashboard1" component={Dashboard1} />
          <Route exact path="/dashboard2" component={Dashboard2} />
          <Route path="/" render={() => {
            return <Redirect to="/dashboard1" />
          }}/>
        </Switch>
      </div>
    );
  }
}

export default App;
