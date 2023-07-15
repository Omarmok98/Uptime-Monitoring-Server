# Uptime-Monitoring-Server

# Uptime Monitoring Server

Monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Dev Dependencies](#dev-dependencies)
- [Author](#author)
- [License](#license)
- [Bugs](#bugs)
- [Repository](#repository)
- [Homepage](#homepage)

## Installation

To install the Uptime Monitoring Server, follow these steps:

1. Clone the repository: `git clone https://github.com/Omarmok98/Uptime-Monitoring-Server.git`
2. Navigate to the project directory: `cd Uptime-Monitoring-Server`
3. Install the dependencies: `npm install`

## Usage

To start the server, run the following command:

```bash
npm start
```

The server will start running on the specified port.

## Scripts

The following scripts are available:

- `start`: Runs the server using `node index.js`.
- `test`: Runs the test suite using Jest.

To run a script, use the following command:

```bash
npm run <script-name>
```

## Dependencies

The Uptime Monitoring Server has the following dependencies:

- axios: ^1.4.0
- bcrypt: ^5.1.0
- body-parser: ^1.20.2
- dotenv: ^16.3.1
- express: ^4.18.2
- joi: ^17.9.2
- jsonwebtoken: ^9.0.1
- mongoose: ^7.3.2
- node-pushover: ^1.0.0
- nodemailer: ^6.9.3

To install these dependencies, run the following command:

```bash
npm install
```

## Dev Dependencies

The Uptime Monitoring Server has the following dev dependencies:

- eslint: ^8.44.0
- eslint-config-google: ^0.14.0
- jest: ^29.6.1
- mongodb: ^5.7.0
- mongodb-memory-server: ^8.13.0

To install these dev dependencies, run the following command:

```bash
npm install --save-dev
```
