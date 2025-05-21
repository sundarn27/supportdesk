import logo from './logo.svg';
import './App.scss';
import { Button } from 'antd';
import TicketList from './components/List/TicketList';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
