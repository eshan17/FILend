const { ethers } = require("hardhat");
const { use, expect } = require("chai");

let accounts;
let lender0;
let amount0;

let mockERC20;
let lenderVault;

before(async function () {
    // get accounts from hardhat
    accounts = await ethers.getSigners();
    lender0 = accounts[0];
    amount0 = ethers.utils.parseEther('100');
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
            expect(lenderVault.address).to.not.be.undefined;
            console.log("lenderVault.address: ", lenderVault.address);
        });
    });

    describe("deposit", function () {
        it("Should be able to deposit into vault", async function () {
            await mockERC20.faucet(lender0.address, amount0);
            await mockERC20.approve(lenderVault.address, amount0);
            const tx = await lenderVault.deposit(amount0, lender0.address);
            expect(tx).to.emit(lenderVault, 'Deposit').withArgs(lender0.address, lender0.address, amount0);
            expect(await lenderVault.balanceOf(lender0.address)).to.equal(amount0);
        }) 
    });
});