window.getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.send('eth_requestAccounts');
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
  });