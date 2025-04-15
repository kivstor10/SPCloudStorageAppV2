import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import outputs from "../amplify_outputs.json";

import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import { ThemeProvider } from './contexts/ThemeContext';

Amplify.configure(
  outputs,
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      {({ theme }) => (
        <Authenticator 
          socialProviders={['apple', 'facebook', 'google']}
          components={{
            SignIn: {
              Header: () => (
                <div style={{
                  textAlign: 'center',
                  padding: '1rem',
                  color: theme === 'dark' ? '#FFFFFF' : '#231F20'
                }}>
                  <h2>Welcome Back</h2>
                </div>
              ),
            },
          }}
        >
          <App />
        </Authenticator>
      )}
    </ThemeProvider>
  </StrictMode>
);