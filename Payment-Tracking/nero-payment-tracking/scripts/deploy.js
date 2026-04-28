import { ethers } from "ethers";
import fs from "fs";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.NERO_RPC_URL || "https://rpc-testnet.nerochain.io");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const contractJson = JSON.parse(fs.readFileSync("./artifacts/contracts/PaymentTracking.sol/PaymentTracking.json", "utf8"));
  const factory = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode, wallet);

  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log(`PaymentTracking deployed to: ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
