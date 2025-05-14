import { Provider } from '~components/ui/provider';
import ReactDOM from 'react-dom/client';
import App from './App';
import React from 'react';
import { AuthProvider } from '~/contexts/authProvider';

const rootElement = document.getElementById('root');

if (rootElement instanceof HTMLElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </React.StrictMode>,
  );
}
