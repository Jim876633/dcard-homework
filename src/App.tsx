import { Route, Routes } from 'react-router-dom';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { IssuesPage } from './pages/IssuesPage';
import { LoginPage } from './pages/LoginPage';
import { LayoutElement } from './components/Layout/Layout';
import { ProtectRoutes } from './components/Routes/ProtectRoutes';

//TODO: test protect routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/issues" element={<LayoutElement />}>
        <Route element={<ProtectRoutes />}>
          <Route index element={<IssuesPage />} />
          <Route
            path="/issues/detail/:detailId"
            element={<IssueDetailPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
