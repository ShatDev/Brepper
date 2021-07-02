var goalElement = document.querySelectorAll('.goal')
var raisedElement  = document.querySelectorAll('.raised')
const donateButton = document.querySelector('#contribute-button')
const documentLink = document.querySelector("#doc-link")

window.addEventListener('load', () => {
  window.getWeb3().then(async (web3) => {
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

         var admin = await fundraiserInstance.methods.admin().call()
         console.log(admin)
         const [adminAcc] = await getAccounts();
         console.log(adminAcc)
          if(admin.toLowerCase() !== adminAcc) {
            console.log("Not Admin")
          } else {
            console.log("Admin")
          }; 

          const goal = await fundraiserInstance.methods.goal().call()

  
          for(var i = 0 ; i < goalElement.length ; i++ ) {
            goalElement[i].innerText = web3.utils.fromWei(goal)
          }
          // const deadline = await fundraiserInstance.methods.deadline().call()
          // document.querySelector('.deadline').innerText = deadline
          const raisedAmount = await fundraiserInstance.methods.raisedAmount().call()

          for(var r = 0; r < raisedElement.length ; r++){
            raisedElement[r].innerText = web3.utils.fromWei(raisedAmount)
          }  
         const contributeAmount = document.querySelector("#contribute-amount");
          donateButton.addEventListener("click", async function() {
            const [account] = await getAccounts()
            if(contributeAmount.value == null){
              alert("please enter a value");
            }
            fundraiserInstance.methods.contribute().send({from : account , value: web3.utils.toWei(contributeAmount.value)})
          })
         
         document.querySelector(".related-documents").setAttribute("href", documentLink.value)




        })()
      });
    });
  });
});
