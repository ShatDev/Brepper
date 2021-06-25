const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const mnemonic = process.env.PRIVATE_KEY;
const url = process.env.RPC_URL;

module.exports = {
  networks: {
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(mnemonic, url);
      },
      network_id: "4",
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.6",
    },
  },
};
