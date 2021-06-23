const fundingContract = artifacts.require('MyContract')
const creator = artifacts.require('LinkTokenInterface')

var web3 = new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws"));