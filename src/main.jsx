import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './index.css';
const theme = createTheme({});
createRoot(document.getElementById('root')).render(
  <MantineProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MantineProvider>
);
