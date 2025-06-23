<div align="center">
  <h1 align="center">Daan: A Trustworthy Web3 Crowdfunding Platform</h1>
  <p align="center">
    Secure, Transparent, and Smarter Giving, powered by Blockchain and AI.
    <br />
    <a href="https://github.com/vishesh2305/daan/issues">Report Bug</a>
    ·
    <a href="https://github.com/vishesh2305/daan/issues">Request Feature</a>
  </p>

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stars](https://img.shields.io/github/stars/vishesh2305/daan)

</div>

---

## About The Project

<p align="center">
  <img src="../DAAN/client/src/assets/images/landing_page_image.png" alt="Daan Landing Page">
</p>

Daan addresses the critical flaws in traditional crowdfunding platforms: lack of trust, risk of fraud, and the inefficient use of donated funds. We provide a comprehensive solution that leverages cutting-edge technology to create a secure, transparent, and more impactful giving experience.

**Our platform solves three core problems:**
* **Trust Deficit:** Donors are often hesitant to contribute due to the prevalence of fraudulent campaigns.
* **Lack of Transparency:** Once a donation is made, the money trail goes cold, leaving donors uncertain about how their funds are managed.
* **Idle, Depreciating Funds:** Donated money sits in a bank account, losing value to inflation, while platforms take hefty fees.

Daan reimagines this process by integrating Web3 and AI to build a system where every participant can act with confidence.

---

## Key Features

Daan is built on three innovative pillars that set it apart from any Web2 alternative:

* 🔐 **Secure & Verified Identity**
    * **Aadhaar + Face Recognition:** We have a mandatory identity verification process for all campaign creators. Using OCR for Aadhaar cards and real-time facial recognition, we ensure every creator is a real, accountable person, virtually eliminating the risk of fake profiles.

* 🤖 **AI-Powered Fraud Detection**
    * **Real-time Campaign Analysis:** As a creator writes their campaign story, our custom-trained AI model analyzes the text in real-time to detect language patterns associated with fraudulent claims. Campaigns flagged by the AI are prevented from launching, protecting donors from the start.

* 📈 **Automated Fund Growth via DeFi Integration**
    * **Yield-Generating Donations:** This is our game-changing feature. Instead of sitting idle, all collected funds are automatically deposited into the **Aave Protocol**, a blue-chip decentralized finance (DeFi) lending pool.
    * **Amplify Your Impact:** The funds generate interest, meaning the total donation pool grows over time. A $100 donation can become $102 by the end of the campaign, making every contribution more powerful.

* ⛓️ **Decentralized & Transparent Transactions**
    * **Direct Wallet-to-Contract Donations:** All transactions are handled peer-to-peer using **MetaMask**, from the donor directly to the campaign's secure smart contract.
    * **On-Chain Audit Trail:** Every donation and withdrawal is a public transaction on the blockchain, creating an immutable and fully transparent audit trail for all to see.

---

## Built With

This project was made possible by leveraging a modern, full-stack technology set.

| Technology | Logo |
| :--- | :---: |
| **Frontend** | |
| React | <img src="https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=for-the-badge" /> |
| Vite | <img src="https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge" /> |
| Tailwind CSS | <img src="https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge" /> |
| **Backend & Database** | |
| Node.js | <img src="https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge" /> |
| Express.js | <img src="https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white&style=for-the-badge" /> |
| MongoDB | <img src="https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge" /> |
| **Blockchain** | |
| Solidity | <img src="https://img.shields.io/badge/-Solidity-363636?logo=solidity&logoColor=white&style=for-the-badge" /> |
| Hardhat | <img src="https://img.shields.io/badge/-Hardhat-FFF670?logo=hardhat&logoColor=black&style=for-the-badge" /> |
| **AI / Machine Learning** | |
| Python | <img src="https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white&style=for-the-badge" /> |
| Flask | <img src="https://img.shields.io/badge/-Flask-000000?logo=flask&logoColor=white&style=for-the-badge" /> |
| PyTorch | <img src="https://img.shields.io/badge/-PyTorch-EE4C2C?logo=pytorch&logoColor=white&style=for-the-badge" /> |

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* **Node.js** and **npm** installed.
* **Python** and **pip** installed.
* **MetaMask** browser extension.
* A `.env` file in the `daan/` directory with your `PRIVATE_KEY`.
* A `.env` file in the `backend/` directory with your `MONGO_URI` and `SESSION_SECRET`.

### Installation & Setup

1.  **Clone the Repo**
    ```sh
    git clone [https://github.com/vishesh2305/daan.git](https://github.com/vishesh2305/daan.git)
    ```

2.  **Install Frontend Dependencies**
    ```sh
    cd client
    npm install
    ```

3.  **Install Backend Dependencies**
    ```sh
    cd ../backend
    npm install
    ```

4.  **Install Smart Contract Dependencies**
    ```sh
    cd ../daan
    npm install
    ```

5.  **Install AI Service Dependencies**
    ```sh
    cd ../crowdfunding_ai-agent
    pip install -r requirements.txt
    ```

### Running the Application

You will need to run the four main components of the application in separate terminals.

1.  **Start the Backend Server**
    ```bash
    # In the /backend directory
    npm start
    ```

2.  **Start the AI/ML Flask Server**
    ```bash
    # In the /crowdfunding_ai-agent/app directory
    python app.py
    ```

3.  **Deploy the Smart Contract** (First time setup)
    ```bash
    # In the /daan directory
    npx hardhat node # Starts a local blockchain
    # In a new terminal, from the /daan directory:
    npx hardhat run scripts/deploy.js --network localhost
    ```
    *After deploying, copy the new contract address and ABI into `client/src/constants/index.js`.*

4.  **Start the Frontend Development Server**
    ```bash
    # In the /client directory
    npm run dev
    ```
    Your application should now be running on `http://localhost:5173`.

---

## Future Roadmap

-   [ ] **Multi-Chain Support:** Integrate with L2s like Polygon to reduce gas fees.
-   [ ] **NGO & Government Partnerships:** Create official channels for established organizations to fundraise.
-   [ ] **Enhanced Analytics:** Provide creators with a detailed dashboard to track donor engagement.
-   [ ] **Fiat On-Ramp:** Allow donations via traditional methods like UPI and credit cards.

See the [open issues](https://github.com/vishesh2305/daan/issues) for a full list of proposed features.

---

## Acknowledgments

* A big thank you to the organizers of this hackathon for the opportunity.
* Hat tip to the open-source communities behind the amazing tools we used.

---