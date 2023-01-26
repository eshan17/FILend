const { ethers } = require("hardhat");
const { use, expect } = require("chai");

let accounts;
let mockERC20;
let lenderVault;

before(async function () {
    // get accounts from hardhat
    accounts = await ethers.getSigners();
});
  
describe("LenderVault", function () {
    describe("Deploy", function () {
        it("Should deploy", async function () {
            const MockERC20 = await ethers.getContractFactory("MockERC20");
            mockERC20 = await MockERC20.deploy();
            expect(mockERC20.address).to.not.be.undefined;
            console.log("mockERC20.address: ", mockERC20.address);

            const LenderVault = await ethers.getContractFactory("LenderVault");
            lenderVault = await LenderVault.deploy(mockERC20.address, 'Junior FILend FIL', 'jfFIL');
            //await lenderVault.deployed();
            //expect(await lenderVault.owner()).to.equal(accounts[0].address);
            expect(lenderVault.address).to.not.be.undefined;
            console.log("lenderVault.address: ", lenderVault.address);
        });
    });
});