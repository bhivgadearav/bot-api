# Solana Wallet API Server 🌐💳

## Overview

This is an API server for managing Solana wallets, built with **Node.js**, **Express**, and **TypeScript**. The server provides robust functionality for:
- User signup
- Network switching
- Balance checking
- SOL transfers

It seamlessly interacts with a **MongoDB** database to store user information and wallet details.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Models](#models)
- [Controllers](#controllers)
- [Running the Server](#running-the-server)

## Installation 🛠️

1. **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd backend
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Build the project:**
    ```sh
    npm run build
    ```

## Configuration 🔧

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
API_TOKEN=your_api_token
```

## API Endpoints 🚪

### User Signup
- **Endpoint:** `/api/signup`
- **Method:** `POST`
- **Description:** Signup and create a new Solana wallet

**Request Body:**
```json
{
    "telegramId": "string",
    "password": "string",
    "name": "string"
}
```

**Response:**
```json
{
    "message": "User created",
    "mnemonic": "string",
    "publicKey": "string",
    "privateKey": "string"
}
```

### Switch Network
- **Endpoint:** `/api/network/switch`
- **Method:** `POST`
- **Description:** Switch to mainnet, devnet, or connect to Solana blockchain using a custom RPC URL

**Request Body:**
```json
{
    "telegramId": "string",
    "password": "string",
    "network": "string",
    "rpcUrl": "string" // required if network is 'custom'
}
```

**Response:**
```json
{
    "message": "Network switched successfully"
}
```

### Get Balance
- **Endpoint:** `/api/balance`
- **Method:** `POST`
- **Description:** Get the native SOL balance of a wallet

**Request Body:**
```json
{
    "telegramId": "string",
    "password": "string",
    "walletName": "string"
}
```

**Response:**
```json
{
    "balance": "number"
}
```

### Transfer SOL
- **Endpoint:** `/api/transfer`
- **Method:** `POST`
- **Description:** Transfer SOL to another wallet

**Request Body:**
```json
{
    "telegramId": "string",
    "password": "string",
    "to": "string",
    "amount": "number",
    "walletName": "string"
}
```

**Response:**
```json
{
    "signature": "string"
}
```

## Middleware 🔒

### Access Middleware
- **File:** `access.ts`
- **Description:** Validates the API token in the request body

### Authentication Middleware
- **File:** `auth.ts`
- **Description:** Authenticates the user based on the telegram ID and password

## Models 📊

### User Model
- **File:** `userModel.ts`
- **Description:** Defines the schema for user documents in MongoDB

## Controllers 🎮

### User Controller
- **File:** `userController.ts`
- **Description:** Handles user-related operations such as signup

### Transaction Controller
- **File:** `txnController.ts`
- **Description:** Handles transaction-related operations such as:
  - Network switching
  - Balance checking
  - SOL transfers

## Running the Server 🚀

1. **Start the backend server:**
    ```sh
    npm run start
    ```

2. **Expose the server on the internet using ngrok:**
    ```sh
    ngrok http http://localhost:3000
    ```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License. 