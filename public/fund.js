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
      $.getJSON("/CrowdFunding.json", (CrowdFundingContract) => {
        const deployedNetwork = FundingCreatorContract.networks[networkId];
        const instance = new web3.eth.Contract(
          FundingCreatorContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        (async () => {
          const address = await instance.methods.getFundingContractAddress(params.index).call();
          const fundraiserInstance = new web3.eth.Contract(
            CrowdFundingContract.abi,
            address
          );
          console.log(fundraiserInstance)
          const goal = await fundraiserInstance.methods.goal().call()
          document.getElementById('goal_value').innerText = goal
          const deadline = await fundraiserInstance.methods.deadline().call()
          document.getElementById('deadline_value').innerText = deadline
          const raisedAmount = await fundraiserInstance.methods.raisedAmount().call()
          document.getElementById('raisedAmount_value').innerText = raisedAmount
        })()
      });
    });
  });
});
