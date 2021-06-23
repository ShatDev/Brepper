import React, { Component } from "react";
import FundingCreatorContract from "./contracts/fundingCreator.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    instance: undefined
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FundingCreatorContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FundingCreatorContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      this.setState({ instance });
      console.log(instance.methods)
      // await instance.methods.createFunding(100, 10000).call();
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    return (
      <div className="App">
        <h1>WEB3 Initialised</h1>
      </div>
    );
  }
}

export default App;
