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


# --- 2. SMART CONTRACT ABI ---

#
# >>>>> CRITICAL ACTION REQUIRED <<<<<
# YOU MUST REPLACE THE ABI BELOW WITH THE ABI FROM YOUR NEWLY DEPLOYED CONTRACT.
# THE CORRECT ABI WILL INCLUDE THE "invest" AND "reclaim" FUNCTIONS.
# GET THIS FROM THE COMPILER TAB IN REMIX AFTER YOU DEPLOY.
#

CROWDFUNDING_ABI = """
[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_wethGatewayAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_aavePoolAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundsInvested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundsReclaimed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "aavePool",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
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
    "name": "invest",
    "outputs": [],
    "stateMutability": "payable",
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
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "reclaim",
    "outputs": [],
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
    "name": "refundDonors",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "wethGateway",
    "outputs": [
      {
        "internalType": "contract IWETHGateway",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
"""


# Create contract instance
crowdfunding_contract = w3.eth.contract(address=CROWDFUNDING_CONTRACT_ADDRESS, abi=CROWDFUNDING_ABI)


# --- 3. AGENT'S CORE LOGIC ---

def send_transaction(txn):
    """Signs and sends a transaction, then waits for the receipt."""
    signed_txn = w3.eth.account.sign_transaction(txn, private_key=AGENT_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    print(f"Transaction sent with hash: {tx_hash.hex()}")
    print("Waiting for transaction receipt...")
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=300)
    print(f"Transaction successful! Block: {tx_receipt.blockNumber}")
    return tx_receipt

def call_invest_function():
    """Tells the smart contract to invest its own funds."""
    print(">>> Condition met. Telling contract to invest funds...")
    try:
        txn = crowdfunding_contract.functions.invest().build_transaction({
            'from': agent_account.address,
            'nonce': w3.eth.get_transaction_count(agent_account.address),
            'gas': 350000,
            'maxFeePerGas': w3.to_wei(20, 'gwei'),
            'maxPriorityFeePerGas': w3.to_wei(2, 'gwei'),
            'chainId': w3.eth.chain_id
        })
        send_transaction(txn)
        return True
    except Exception as e:
        print(f"!!! Error calling invest function: {e}")
        return False

def call_reclaim_function(amount_to_reclaim):
    """Tells the smart contract to reclaim its funds from Aave."""
    print(f">>> Deadline approaching. Telling contract to reclaim {w3.from_wei(amount_to_reclaim, 'ether')} ETH...")
    try:
        txn = crowdfunding_contract.functions.reclaim(amount_to_reclaim).build_transaction({
            'from': agent_account.address,
            'nonce': w3.eth.get_transaction_count(agent_account.address),
            'gas': 400000,
            'maxFeePerGas': w3.to_wei(20, 'gwei'),
            'maxPriorityFeePerGas': w3.to_wei(2, 'gwei'),
            'chainId': w3.eth.chain_id
        })
        send_transaction(txn)
    except Exception as e:
        print(f"!!! Error calling reclaim function: {e}")


def main_loop():
    """The main monitoring loop for the agent."""
    INVESTMENT_THRESHOLD_WEI = w3.to_wei(0.01, 'ether')
    # Simple state management: track if funds are currently invested
    funds_are_invested = False

    while True:
        try:
            print("\n--- Running Check Cycle ---")
            
            contract_balance_wei = w3.eth.get_balance(CROWDFUNDING_CONTRACT_ADDRESS)
            print(f"Crowdfunding contract balance: {w3.from_wei(contract_balance_wei, 'ether')} ETH")

            # --- INVESTMENT LOGIC ---
            if not funds_are_invested and contract_balance_wei >= INVESTMENT_THRESHOLD_WEI:
                if call_invest_function():
                    funds_are_invested = True  # Update state only after a successful call

            # --- RECLAIM LOGIC ---
            # This is simplified. A real agent would check campaign deadlines to decide when to reclaim.
            if funds_are_invested and contract_balance_wei < w3.to_wei(0.001, 'ether'):
                 print("Funds are invested. In a real scenario, you would check deadlines to reclaim.")
                 # When ready, you can uncomment and adapt the line below:
                 # call_reclaim_function(INVESTMENT_THRESHOLD_WEI)
                 # funds_are_invested = False
            
            print("--- Check Cycle Complete ---")
            time.sleep(60)

        except Exception as e:
            print(f"An error occurred in the main loop: {e}")
            time.sleep(60)

if __name__ == "__main__":
    main_loop()