import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import "./assets/styles/admin/style.css";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Products from './pages/admin/Products';
import Parcels from './pages/admin/Parcels';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact component={Products} path="/admin/products"/>
        <Route exact component={Parcels} path="/admin/parcels"/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
