const FundingCreator = artifacts.require("FundingCreator");

contract("FundingCreator", accounts => {
  it("should be defined", () => {
    return FundingCreator.deployed()
      .then(instance => {
        assert.isDefined(
          instance
        );
      })
      
  });
});