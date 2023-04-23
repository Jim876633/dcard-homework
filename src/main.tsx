import '@styles/index.scss';
import ReactDOM from 'react-dom/client';
import App from './App';
import { IssuesContextProvier } from './context/useIssuesContext';
import { AccessTokenContextProvider } from './context/useTokenContext';
import { UIContextProvier } from './context/useUIContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <UIContextProvier>
    <AccessTokenContextProvider>
      <IssuesContextProvier>
        <App />
      </IssuesContextProvier>
    </AccessTokenContextProvider>
  </UIContextProvier>
);
