📁 Decentralized File Sharing System Using IPFS and Blockchain

Final Year Project (Bachelor of Computer Science – Computer Networks)

📌 Project Overview

This project presents a decentralized file sharing system that integrates InterPlanetary File System (IPFS) with blockchain technology to provide secure, tamper-resistant, and distributed file storage.

Unlike traditional centralized storage systems, this solution eliminates single points of failure by distributing files across a peer-to-peer network while using blockchain to ensure data integrity, access control, and traceability.

🎯 Problem Statement

Conventional cloud storage platforms rely on centralized servers, which are vulnerable to:

Single point of failure

Data tampering

Unauthorized access

Limited transparency in file ownership and access control

This project addresses these issues by combining IPFS for decentralized storage and blockchain for secure verification and management of file metadata.

🏗️ System Architecture

The system operates through the following workflow:

User uploads a file via the web interface

File is stored in IPFS and returns a unique Content Identifier (CID)

The CID and file metadata are recorded on the blockchain via a smart contract

File integrity is verified using cryptographic hashing

Authorized users retrieve the file using the stored CID

✨ Key Features

Decentralized file storage using IPFS

Blockchain-based verification of file metadata

Tamper-resistant file integrity using cryptographic hashing

Peer-to-peer architecture without centralized control

Transparent and auditable file access records

🛠️ Technologies Used
Frontend

React

TypeScript

Vite

Tailwind CSS

shadcn-ui

Backend & Blockchain

IPFS (InterPlanetary File System)

Blockchain Technology

Smart Contracts

Cryptographic Hashing

Peer-to-Peer Networking

⚙️ Installation & Setup
Prerequisites

Ensure the following are installed on your system:

Node.js

npm

Git

Steps to Run Locally
# Clone the repository
git clone https://github.com/wann21/ether-share-hub1.git

# Navigate into the project directory
cd ether-share-hub1

# Install dependencies
npm install

# Run the development server
npm run dev


The application will be available at:

http://localhost:5173

🚀 Usage

Access the web application

Upload a file to the system

File is stored in IPFS and verified via blockchain

Retrieve the file using the generated CID

🔮 Future Enhancements

User authentication and role-based access control

File encryption before IPFS storage

Smart contract optimization for scalability

Performance evaluation and benchmarking

Integration with decentralized identity (DID) systems

👤 Author

Muhammad Safwan bin Hirman
Bachelor of Computer Science (Hons.) Computer Networks
Universiti Teknologi MARA (UiTM)

📜 License

This project is developed for academic purposes (Final Year Project).
