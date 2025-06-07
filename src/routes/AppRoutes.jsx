import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useParams,
} from "react-router-dom";
import Home from '../pages/Home/Home';
import Dashboard from '../components/Dashboard/Dashboard';
import TicketList from '../components/List/TicketList';
import Settings from '../components/Settings/Settings';

const AppRoutes = () => (
  <Router>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:key" element={<Home />} />
        <Route path="/:key/:prm" element={<Home />} />
    </Routes>
  </Router>
);

export default AppRoutes;
