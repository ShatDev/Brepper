const getWeb3 = () =>
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

var account

window.addEventListener('load', () => {
  getWeb3().then(async (web3) => {
    const networkId = await web3.eth.net.getId();
    $.getJSON("/FundingCreator.json", (FundingCreatorContract) => {
      const deployedNetwork = FundingCreatorContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FundingCreatorContract.abi,
      "0x284D10E9cfFE48b5A41eB0a9F400E9881b6a2202"
      );
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
        (async () => {
          const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
          const fundRaiser = await instance.methods.getFundingContract(params.contract).send({from: account})
          console.log(fundRaiser)
          const fundRaiserInstance = new web3.eth.Contract(
            fundRaiser,
            params.contract
          );
          console.log(fundRaiserInstance)
          window.fundRaiserInstance = fundRaiserInstance;
        })()
    });
    if (web3.eth.accounts[0] !== account) {
      account = web3.eth.accounts[0];
      console.log(account);
      // below method needs to be defined
      //updateInterface();
    }
  });
});
