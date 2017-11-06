import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Signin from './Signin';
import Dashboard from './Dashboard';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Signin} />
          <Route path='/dashboard' component={Dashboard} />
        </div>
      </Router>
    );
  }
};

export default App;
