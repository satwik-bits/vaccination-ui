import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/" exact component={Login} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
