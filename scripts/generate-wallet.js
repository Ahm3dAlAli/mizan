#!/usr/bin/env node

// Generate testnet wallet for Mizan hackathon

const crypto = require('crypto');
const { createHash } = crypto;

// Simple wallet generation (for demo purposes)
console.log('\n=== GENERATING TESTNET WALLET ===\n');

// Generate random bytes
const privateKeyBytes = crypto.randomBytes(32);
const privateKey = '0x' + privateKeyBytes.toString('hex');

console.log('🔑 Private Key (SAVE THIS SECURELY):');
console.log(privateKey);
console.log('\n⚠️  IMPORTANT:');
console.log('1. Copy the private key above');
console.log('2. Paste it into your .env file as PRIVATE_KEY');
console.log('3. NEVER commit your .env file to git');
console.log('4. This is a testnet wallet - DO NOT use for real funds\n');

console.log('📍 Get Test USDC:');
console.log('   Circle Faucet: https://faucet.circle.com');
console.log('   Arc Faucet: https://faucet.arc.network\n');

console.log('🔗 Add Arc Testnet to MetaMask:');
console.log('   Network Name: Arc Testnet');
console.log('   RPC URL: https://rpc.testnet.arc.network');
console.log('   Chain ID: 5042002');
console.log('   Currency Symbol: USDC');
console.log('   Block Explorer: https://testnet.arcscan.app\n');

// Generate a simple mnemonic for reference (not cryptographically secure, just for demo)
const wordList = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid'
];

const mnemonic = Array.from({ length: 12 }, () =>
  wordList[Math.floor(Math.random() * wordList.length)]
).join(' ');

console.log('📝 Reference Mnemonic (for your records):');
console.log(mnemonic);
console.log('\n✅ Wallet generated successfully!\n');
