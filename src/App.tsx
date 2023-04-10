import { Route, Routes } from 'react-router-dom';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { IssuesPage } from './pages/IssuesPage';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/Layout/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/issues/detail/:detailId" element={<IssueDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
