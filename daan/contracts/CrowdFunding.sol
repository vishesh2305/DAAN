// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


interface IWETHGateway {
    function depositETH(address pool, address onBehalfOf, uint16 referralCode) external payable;
    function withdrawETH(address pool , uint256 amount, address to) external;
}



contract CrowdFunding is ReentrancyGuard{
    struct Campaign{
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        bool claimed;
}
    mapping(uint256 => Campaign)  public campaigns;
    uint256 public numberofCampaigns =0;


    address public owner;
    IWETHGateway public immutable wethGateway;
    address public immutable aavePool;

    event FundsInvested(uint256 amount);
    event FundsReclaimed(uint256 amount);

    modifier onlyOwner(){
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

    constructor(address _wethGatewayAddress, address _aavePoolAddress){
        owner = msg.sender;
        wethGateway = IWETHGateway(_wethGatewayAddress);
        aavePool = _aavePoolAddress;
    }


    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256){
    require(_deadline > block.timestamp, "The deadline should be date in the future.");
        Campaign storage campaign = campaigns[numberofCampaigns];
    campaign.owner = _owner;
    campaign.title = _title;
    campaign.description = _description;
    campaign.target = _target;
    campaign.deadline = _deadline;
    campaign.amountCollected = 0;
    campaign.image = _image;
    numberofCampaigns++;
    return numberofCampaigns -1;
    }


    function donateToCampaign(uint256 _id) public payable nonReentrant{
        uint256 amount =msg.value;
        Campaign storage campaign = campaigns[_id];

        require(block.timestamp < campaign.deadline, "Campaign has Ended.");

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        campaign.amountCollected= campaign.amountCollected + amount;
    }

    function claimFunds(uint256 _id) public nonReentrant{
        Campaign storage campaign = campaigns[_id];

        require(msg.sender == campaign.owner, "Only the owner can claim");

        require(block.timestamp >= campaign.deadline, "Campaign is still active");

        require(campaign.amountCollected >= campaign.target, "Campaign target not met.");

        require(!campaign.claimed, "Funds already claimed.");

        campaign.claimed = true;

        (bool sent, ) = payable(campaign.owner).call{value: campaign.amountCollected}("");

        require(sent, "Failed to send funds");
    }



    function invest() external payable onlyOwner{
        uint256 amountToInvest = address(this).balance;
        require(amountToInvest > 0, "No funds to invest.");

        wethGateway.depositETH{value: amountToInvest}(aavePool, address(this), 0);

        emit FundsInvested(amountToInvest);

    }


    function reclaim(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero.");

        wethGateway.withdrawETH(aavePool, amount, address(this));

        emit FundsReclaimed(amount);
    }



    function refundDonors(uint256 _id) public nonReentrant{
        Campaign storage campaign = campaigns[_id];

        require(block.timestamp >= campaign.deadline, "Campaign is Still active.");
        require(campaign.amountCollected < campaign.target, "Campaign target was met");

        for(uint i=0; i<campaign.donators.length; i++){
            address donor = campaign.donators[i];
            uint256 donationAmount = campaign.donations[i];
            (bool sent, ) = payable(donor).call{value: donationAmount}("");
        }

    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory){
        return (campaigns[_id].donators, campaigns[_id].donations);
    }
    function getCampaigns() public view returns (Campaign[] memory){
        Campaign[] memory allCampaigns = new Campaign[](numberofCampaigns);
        for(uint i=0; i<numberofCampaigns; i++){
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }
        return allCampaigns;
    }
}