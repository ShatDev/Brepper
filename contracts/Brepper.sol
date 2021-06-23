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
    mapping(uint => Request) public requests;
    uint public numRequests;

    struct Request {
        string description;
        address payable recipient;
        uint value;
        bool completed;
        uint noOfVoters;
        mapping(address => bool) voters;
    }
    
    event ContributeEvent(address _sender, uint _value);
    event CreateRequestEvent(string _description, address _recipient, uint _value);
    event MakePaymentEvent(address _recipient, uint _value);
    
    constructor(uint _goal, uint _deadline, address eoa) public {
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
    function refund() public {
        require(block.timestamp > deadline && raisedAmount < goal);
        require(contributors[msg.sender] > 0 );
        
        address payable recipient = payable(msg.sender);
        uint value = contributors[msg.sender];
        recipient.transfer(value);
 
         contributors[msg.sender] = 0;
    }
    
        modifier onlyAdmin() {
        require(msg.sender == admin,"Only Admin Can Call This Function!");
        _;
    }
    
    function createRequest(string memory _description, address payable _recipient, uint _value ) public onlyAdmin{
        Request storage newRequest = requests[numRequests];
        numRequests++;
        
        newRequest.description = _description;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.completed = false;
        newRequest.noOfVoters = 0;
        
        emit CreateRequestEvent(_description, _recipient, _value);
        
    }
    
    function voteRequest(uint _requestNo) public {
        require(contributors[msg.sender] > 0, "You must be a contributor to vote!");
        Request storage thisRequest = requests[_requestNo];
        
        require(thisRequest.voters[msg.sender] == false, "You have already voted!");
        thisRequest.voters[msg.sender] = true;
        thisRequest.noOfVoters++;
    }
    
    function makePayment(uint _requestNo) public onlyAdmin{
        require(raisedAmount >= goal);
        Request storage thisRequest = requests[_requestNo];
        require(thisRequest.completed == false, "The request has been completed");
        require(thisRequest.noOfVoters >= numberOfContributors / 2); // 50% voted for yes
        
        thisRequest.recipient.transfer(thisRequest.value);
        thisRequest.completed = true;
        
        emit MakePaymentEvent(thisRequest.recipient, thisRequest.value);
    }
}