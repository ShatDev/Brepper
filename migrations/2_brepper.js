const FundingCreator = artifacts.require("FundingCreator");


module.exports = async (deployer) => {
  try {
    await deployer.deploy(FundingCreator , 4 , 400);
  } catch (err) {
    console.error(err);
  }
};
