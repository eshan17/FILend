const { ethers } = require("hardhat");
const { use, expect } = require("chai");

let accounts;
let lender0, lender1;
let amount0, amount1;

let mockERC20;
let lenderVault;

before(async function () {
    // get accounts from hardhat
    accounts = await ethers.getSigners();
    lender0 = accounts[0];
    lender1 = accounts[1];
    amount0 = ethers.utils.parseEther('100');
    amount1 = ethers.utils.parseEther('100');
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
        it("Lenders should be able to deposit into vault", async function () {
            await mockERC20.faucet(lender0.address, amount0);
            await mockERC20.connect(lender0).approve(lenderVault.address, amount0);
            expect(await lenderVault.totalAssets()).to.equal(0);
            expect(await lenderVault.balanceOf(lender0.address)).to.equal(0);
            const tx0 = await lenderVault.connect(lender0).deposit(amount0, lender0.address);
            expect(tx0).to.emit(lenderVault, 'Deposit').withArgs(lender0.address, lender0.address, amount0);
            expect(await lenderVault.balanceOf(lender0.address)).to.equal(amount0);
            expect(await lenderVault.totalAssets()).to.equal(amount0);

            await mockERC20.faucet(lender1.address, amount1);
            await mockERC20.connect(lender1).approve(lenderVault.address, amount1);
            expect(await lenderVault.balanceOf(lender1.address)).to.equal(0);
            const tx1 = await lenderVault.connect(lender1).deposit(amount1, lender1.address);
            expect(tx1).to.emit(lenderVault, 'Deposit').withArgs(lender1.address, lender1.address, amount1);
            expect(await lenderVault.balanceOf(lender1.address)).to.equal(amount1);
            expect(await lenderVault.totalAssets()).to.equal(amount0.add(amount1));
        });
    });

    describe("redeem", function () {
        it("Lenders should be able to redeem from vault", async function () {
            const tx0 = await lenderVault.connect(lender0).redeem(amount0, lender0.address, lender0.address);
            expect(tx0).to.emit(lenderVault, 'Withdraw').withArgs(lender0.address, lender0.address, lender0.address, amount0, amount0);            
        });
    });

    describe("setLoanManager", function () {
        it("Non-owner should not be able to setLoanManager", async function () {
            const tx0 = lenderVault.connect(lender1).setLoanManager(lender1.address);
            await expect(tx0).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("Should be able to setLoanManager", async function () {
            const tx0 = lenderVault.connect(lender0).setLoanManager(lender0.address);
            expect(tx0).to.emit(lenderVault, 'LoanManagerUpdated').withArgs(lender0.address);            
        });
    });
});