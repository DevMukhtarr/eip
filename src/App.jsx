import React, { useState, useEffect } from 'react';
import useEthereumWallet from './useEthereumWallet';

function App() {
  const [addressInput, setAddressInput] = useState('');
  const { account, chainId, connect, disconnect, getBalance } = useEthereumWallet();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (account) {
      setAddressInput(account);
    }
  }, [account]);

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleAddressChange = (e) => {
    setAddressInput(e.target.value);
  };

  const handleGetBalance = async () => {
    if (addressInput) {
      const balanceResult = await getBalance(addressInput);
      setBalance(balanceResult);
    }
  };
  return (
    <div className="App">
      <h1>Wallet Connection</h1>
      {account ? (
        <>
          <p>Connected Account: {account}</p>
          <p>Chain ID: {chainId}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
      <div>
        <input
          type="text"
          value={addressInput}
          onChange={handleAddressChange}
          placeholder="Enter Ethereum address"
        />
        <button onClick={handleGetBalance}>Get Balance</button>
      </div>
      {balance !== null && (
        <p>Balance: {balance} ETH</p>
      )}
    </div>
  );
}

export default App;