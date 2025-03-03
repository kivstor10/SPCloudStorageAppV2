import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import outputs from "../amplify_outputs.json"
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import "@aws-amplify/ui-react/styles.css"

Amplify.configure(outputs);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Authenticator socialProviders={['apple', 'facebook', 'google']}>
        <App />
      </Authenticator>
    </ThemeProvider>
  </StrictMode>,
)
