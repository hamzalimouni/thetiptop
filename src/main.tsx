import 'symbol-observable';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import ReactGA from 'react-ga4';

ReactGA.initialize(import.meta.env.VITE_REACT_APP_GA);

ReactGA.send({ hitType: 'pageview', page: window.location.pathname });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <App />
    </PersistGate>
  </Provider>,
)
