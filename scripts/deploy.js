const hre = require("hardhat");

async function main() {
  const MemeIdeas = await hre.ethers.getContractFactory("MemeIdeas");
  const memeIdeas = await MemeIdeas.deploy();

  await memeIdeas.waitForDeployment();

  console.log("MemeIdeas deployed to:", memeIdeas.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
