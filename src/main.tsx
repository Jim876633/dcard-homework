import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@styles/index.scss';
import { UIContextProvier } from './context/useUIContext';
import { AccessTokenContextProvider } from './context/useTokenContext';
import { IssuesContextProvier } from './context/useIssuesContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <UIContextProvier>
      <AccessTokenContextProvider>
        <IssuesContextProvier>
          <App />
        </IssuesContextProvier>
      </AccessTokenContextProvider>
    </UIContextProvier>
  </BrowserRouter>
);
