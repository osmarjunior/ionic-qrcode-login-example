import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import WelcomePage from './pages/Welcome/WelcomePage';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/welcome" component={WelcomePage} />
    </Switch>
  </Router>
);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
