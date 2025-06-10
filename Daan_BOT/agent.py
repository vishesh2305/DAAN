import os
import time
import json
from web3 import Web3
from dotenv import load_dotenv

# --- 1. CONFIGURATION AND SETUP ---

# Load environment variables from .env file
load_dotenv()

PROVIDER_URL = os.getenv("PROVIDER_URL")
AGENT_PRIVATE_KEY = os.getenv("AGENT_PRIVATE_KEY")
CROWDFUNDING_CONTRACT_ADDRESS = os.getenv("CROWDFUNDING_CONTRACT_ADDRESS")

# Check if configuration is loaded
if not all([PROVIDER_URL, AGENT_PRIVATE_KEY, CROWDFUNDING_CONTRACT_ADDRESS]):
    raise Exception("Please create a .env file and set PROVIDER_URL, AGENT_PRIVATE_KEY, and CROWDFUNDING_CONTRACT_ADDRESS")

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(PROVIDER_URL))
agent_account = w3.eth.account.from_key(AGENT_PRIVATE_KEY)

print(f"Agent started successfully.")
print(f"Connected to blockchain: {w3.is_connected()}")
print(f"Agent Wallet Address: {agent_account.address}")

# --- 2. SMART CONTRACT ADDRESSES & ABIS (Aave V3 on Sepolia Testnet) ---

# NOTE: You must replace this with the ABI from your own compiled contract





CROWDFUNDING_ABI = """
[
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "campaigns",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "target",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountCollected",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "image",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "claimed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "claimFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_target",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_deadline",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_image",
        "type": "string"
      }
    ],
    "name": "createCampaign",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "donateToCampaign",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCampaigns",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountCollected",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "image",
            "type": "string"
          },
          {
            "internalType": "address[]",
            "name": "donators",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "donations",
            "type": "uint256[]"
          },
          {
            "internalType": "bool",
            "name": "claimed",
            "type": "bool"
          }
        ],
        "internalType": "struct CrowdFunding.Campaign[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getDonators",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "numberofCampaigns",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "refundDonors",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
"""




















# Aave V3 WETHGateway ABI (partial) for deposit/withdraw of native ETH
AAVE_GATEWAY_ABI = json.loads("""
[
    {"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"address","name":"onBehalfOf","type":"address"},{"internalType":"uint16","name":"referralCode","type":"uint16"}],"name":"depositETH","outputs":[],"stateMutability":"payable","type":"function"},
    {"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"withdrawETH","outputs":[],"stateMutability":"payable","type":"function"}
]
""")

# Addresses for Aave V3 on Sepolia testnet
AAVE_POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"
AAVE_GATEWAY_ADDRESS = "0x387d311e47e80b498169e6fb51d3193167d89F7D"

# Create contract instances
crowdfunding_contract = w3.eth.contract(address=CROWDFUNDING_CONTRACT_ADDRESS, abi=CROWDFUNDING_ABI)
aave_gateway_contract = w3.eth.contract(address=AAVE_GATEWAY_ADDRESS, abi=AAVE_GATEWAY_ABI)

# --- 3. AGENT'S CORE LOGIC ---

def send_transaction(txn):
    """Signs and sends a transaction, then waits for the receipt."""
    signed_txn = w3.eth.account.sign_transaction(txn, private_key=AGENT_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    print(f"Transaction sent with hash: {tx_hash.hex()}")
    print("Waiting for transaction receipt...")
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Transaction successful! Block: {tx_receipt.blockNumber}")
    return tx_receipt

def invest_funds(amount_wei):
    """Builds and sends a transaction to deposit ETH into Aave."""
    if amount_wei <= 0:
        print("No funds to invest.")
        return

    print(f"Attempting to invest {w3.from_wei(amount_wei, 'ether')} ETH into Aave...")
    
    # We must deposit FROM the crowdfunding contract TO Aave.
    # This requires a function in the crowdfunding contract that the agent can call.
    # For this example, let's assume the agent has the funds and invests on behalf of the contract.
    # A more robust system would have an `invest(amount)` function in CrowdFunding.sol.
    
    # Simplified: Agent invests its own funds (for demonstration)
    # Correct: CrowdFunding contract needs an `invest()` function callable by the agent
    
    # We will call the `depositETH` function on Aave's WETHGateway
    txn = aave_gateway_contract.functions.depositETH(
        AAVE_POOL_ADDRESS,          # The main Aave pool
        agent_account.address,      # The address receiving the aTokens (our agent)
        0                           # Referral code, 0 for none
    ).build_transaction({
        'from': agent_account.address,
        'value': amount_wei, # The amount of ETH to deposit
        'nonce': w3.eth.get_transaction_count(agent_account.address),
        'gas': 300000, # Set a reasonable gas limit
        'maxFeePerGas': w3.to_wei(20, 'gwei'),
        'maxPriorityFeePerGas': w3.to_wei(2, 'gwei'),
        'chainId': w3.eth.chain_id
    })
    
    send_transaction(txn)


def main_loop():
    """The main monitoring loop for the agent."""
    INVESTMENT_THRESHOLD_WEI = w3.to_wei(0.01, 'ether') # Minimum amount to invest
    
    # This is a simple state tracker. A real app would use a database.
    invested_campaigns = set() 

    while True:
        try:
            print("\n--- Running Check Cycle ---")
            
            # Get the total balance of the crowdfunding contract
            contract_balance_wei = w3.eth.get_balance(CROWDFUNDING_CONTRACT_ADDRESS)
            print(f"Crowdfunding contract balance: {w3.from_wei(contract_balance_wei, 'ether')} ETH")

            # In a real system, you would need to add logic here to:
            # 1. Check if the balance > invested amount.
            # 2. If so, invest the difference.
            # This requires adding an `invest(amount)` function to your CrowdFunding.sol
            # that this agent can call.
            
            # For now, this is a placeholder for the investment decision.
            if contract_balance_wei > INVESTMENT_THRESHOLD_WEI:
                 print("Investment condition met. In a real system, this would trigger an investment.")
                 # invest_funds(contract_balance_wei) # This would be called from within the contract
                 pass


            # Check campaign statuses for withdrawal
            num_campaigns = crowdfunding_contract.functions.numberofCampaigns().call()
            print(f"Found {num_campaigns} campaigns to check.")
            
            # In a real system, you would check deadlines and trigger withdrawals from Aave
            # back to the main crowdfunding contract. This also requires a `withdraw(amount)`
            # function in your CrowdFunding.sol contract.
            
            print("--- Check Cycle Complete ---")
            time.sleep(60) # Wait 60 seconds before the next check

        except Exception as e:
            print(f"An error occurred: {e}")
            time.sleep(60)


if __name__ == "__main__":
    main_loop()