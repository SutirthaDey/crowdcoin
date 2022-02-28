pragma solidity ^0.4.17;

contract Factory{
    address[] public deployedCampaigns;

    function addCampaign(uint minimum) public {
        address newCampain = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampain);
    }

    function getCampaigns() public view returns(address[]){
        return deployedCampaigns;
    }
}
contract Campaign{
    address public manager;
    mapping(address=>bool) public approvers;
    uint public minimumContribution;
    uint public totalApprovers;
    Request[] public requests;

    struct Request {
        string description;
        address recipient;
        uint value;
        bool complete;
        uint approvalCounts;
        mapping(address=>bool) voted;
    }

    modifier restricted {
        require(msg.sender == manager);
        _;
    }
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function addApprovers() public payable{
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        totalApprovers++;
    }

    function createRequest(string description,address recipient,uint value) public restricted{
        Request memory newRequest = Request({
            description:description,
            recipient:recipient,
            value:value,
            complete: false,
            approvalCounts: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.voted[msg.sender]);

        request.voted[msg.sender]= true;
        request.approvalCounts++;
    }

    function finalize(uint index) public restricted{
        
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCounts>totalApprovers/2);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint
        ) {
        return (
            this.balance,
            minimumContribution,
            requests.length,
            totalApprovers
        );
    }

    function getRequestLength() public view returns(uint){
        return requests.length;
    }

    function didVote(uint index) public view returns(bool){
        Request storage request = requests[index];
        return request.voted[msg.sender];
    }
}