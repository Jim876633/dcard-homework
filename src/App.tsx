import { Link, Route, Routes } from 'react-router-dom';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { IssuesPage } from './pages/IssuesPage';
import { LoginPage } from './pages/LoginPage';
import { LayoutElement } from './components/Layout/Layout';
import { ProtectRoutes } from './components/Routes/ProtectRoutes';
import { Routers } from './components/Routes/Routers';

function App() {
  return <Routers />;
}

export default App;
