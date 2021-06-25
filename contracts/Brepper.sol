// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.9.0;

contract FundingCreator {
    CrowdFunding[] public fundings;
    
    function createFunding(uint inputGoal, uint inputDeadline) public {
        CrowdFunding newFunding = new CrowdFunding(inputGoal, inputDeadline, msg.sender);
        fundings.push(newFunding);
    }
}

contract CrowdFunding {
    
    mapping(address => uint) public contributors;
    
    address public admin;
    uint public numberOfContributors;
    uint public minimumContribution;
    uint public deadline;
    uint public goal;
    uint public raisedAmount;

    
    event ContributeEvent(address _sender, uint _value);
    event fundsWithdrawn(string _description, address _recipient, uint _value);

    
    constructor(uint _goal, uint _deadline, address eoa)  {
        goal = _goal * (1 ether);
        deadline = block.timestamp + _deadline;
        admin = eoa;
        
        minimumContribution = 100 wei;
    }
    
    function contribute() public payable {
        require(block.timestamp < deadline, "deadline has passed!");
        require(msg.value >= minimumContribution, "Minimum Contribution Not Met!");
        
        if(contributors[msg.sender] == 0){  
            numberOfContributors++;
            } 
            
        contributors[msg.sender] += msg.value;
      
        raisedAmount += msg.value;
        emit ContributeEvent(msg.sender , msg.value);
     }
     
    receive() payable external {
        contribute();
    }
    
    function getBalance() public view returns(uint){
        return address(this).balance;
    }
    
    // Refund Money

    
        modifier onlyAdmin() {
        require(msg.sender == admin,"Only Admin Can Call This Function!");
        _;
    }
    
    function withdrawFunds(string memory _description, address payable _recipient, uint _value ) public onlyAdmin{
        require(raisedAmount >= goal);
       _recipient.transfer(address(this).balance);
        emit fundsWithdrawn(_description, _recipient, _value);
        
    }
    

}