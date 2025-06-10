// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

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