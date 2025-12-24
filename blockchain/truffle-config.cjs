// Minimal Truffle config for Ganache (CommonJS)
// Tip: set env vars if deploying from another PC
//   PowerShell: $env:GANACHE_HOST="192.168.1.103"; $env:GANACHE_PORT="7545"
const host = process.env.GANACHE_HOST || "192.168.1.110"; // e.g. 192.168.1.103
const port = parseInt(process.env.GANACHE_PORT || "7545", 10);

module.exports = {
  networks: {
    development: {
      host,
      port,
      network_id: "1337" // Ganache chain id
    }
  },
  compilers: {
    solc: {
      version: "0.8.21" // compatible with ^0.8.0
    }
  }
};
