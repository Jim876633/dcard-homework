import { Routes, Route } from 'react-router-dom';
import { IssuesContextProvier } from './context/useIssuesContext';
import { AccessTokenContextProvider } from './context/useTokenContext';
import { UIContextProvier } from './context/useUIContext';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { IssuesPage } from './pages/IssuesPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <UIContextProvier>
      <AccessTokenContextProvider>
        <IssuesContextProvier>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/issues" element={<IssuesPage />} />
            <Route
              path="/issues/detail/:detailId"
              element={<IssueDetailPage />}
            />
          </Routes>
        </IssuesContextProvier>
      </AccessTokenContextProvider>
    </UIContextProvier>
  );
}

export default App;
