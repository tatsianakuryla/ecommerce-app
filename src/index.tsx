import { Provider as ChakraProvider } from '~components/ui/provider';
import ReactDOM from 'react-dom/client';
import App from './App';
import React from 'react';

const rootElement = document.getElementById('root');

if (rootElement instanceof HTMLElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>,
  );
}
