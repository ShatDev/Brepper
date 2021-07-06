window.getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.send('eth_requestAccounts');
        resolve(window.web3);
      } catch (error) {
        reject(error);
      }
    }
  });