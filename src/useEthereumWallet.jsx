import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const useEthereumWallet = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);

  const connect = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({method: 'eth_requestAccounts'});
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        const network = await provider.getNetwork();
        
        setAccount(account);
        setChainId(network.chainId.toString());
        setProvider(provider);
      } catch (error) {
        console.error('Failed to connect', error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
  }, []);

  const getBalance = useCallback(async (address) => {
    if (provider) {
      try {
        const balance = await provider.getBalance(address);
        return ethers.formatEther(balance);
      } catch (error) {
        console.error('Failed to get balance', error);
        return null;
      }
    }
    return null;
  }, [provider]);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        disconnect();
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(parseInt(chainId, 16));
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [disconnect]);

  return { account, chainId, connect, disconnect, getBalance };
};

export default useEthereumWallet;