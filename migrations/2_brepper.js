const CrowdFunding = artifacts.require("CrowdFunding");


module.exports = async (deployer) => {
  try {
    await deployer.deploy(CrowdFunding , 4 , 400);
  } catch (err) {
    console.error(err);
  }
};
