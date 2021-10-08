import "bootstrap/dist/css/bootstrap.css";
import './App.css';
import Register from './pages/Register';
import VerificationPage from './pages/VerificationPage';
import {BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Register} path="/register"/>
        <Route component={VerificationPage} path="/authentication/:token"/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
