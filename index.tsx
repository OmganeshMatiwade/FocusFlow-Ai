
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

console.log('EduPulse: Starting application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log('EduPulse: Root element found, creating React root...');

const root = ReactDOM.createRoot(rootElement);

console.log('EduPulse: Rendering App component...');

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('EduPulse: Application rendered successfully!');
