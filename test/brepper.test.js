const CrowdFunding = artifacts.require("CrowdFunding");

contract("FundingCreator", accounts => {
  it("should be defined", () => {
    return CrowdFunding.deployed()
      .then(instance => {
        assert.isDefined(
          instance
        );
      })
      
  });
});