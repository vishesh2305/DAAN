import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider, metamaskWallet } from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk';
import { StateContextProvider } from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider 
  activeChain="sepolia"
  clientId='96e314d5dd51eda9aa4968174509249a'
  supportedWallets={[metamaskWallet()]}> 
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider> 
)