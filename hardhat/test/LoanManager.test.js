const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { use, expect } = require("chai");

let accounts;
let owner, lender0, lender1, borrower2;
let depositAmount0, depositAmount1, depositAmount3, loanAmount2, paybackPrincipal2, paybackInterest2, lossPrincipal2, wrapAmount4;
let lockPeriod3;

let mockERC20;
let lenderVaultJunior;
let lenderVaultSenior;
let loanManager;

const oneYear = 3600 * 24 * 365;

before(async function () {
    // get accounts from hardhat
    accounts = await ethers.getSigners();
    owner = accounts[0];
    lender0 = accounts[0];
    lender1 = accounts[1];
    borrower2 = accounts[2];
    depositAmount0 = ethers.utils.parseEther('100');
    depositAmount1 = ethers.utils.parseEther('100');
    depositAmount3 = ethers.utils.parseEther('100');
    loanAmount2 = ethers.utils.parseEther('140');
    paybackPrincipal2 = ethers.utils.parseEther('5');
    paybackInterest2 = ethers.utils.parseEther('5');
    lossPrincipal2 = ethers.utils.parseEther('2');
    lockPeriod3 = 100000;
    wrapAmount4 = ethers.utils.parseEther('500');
});
  
describe("LoanManager", function () {
    describe("Deploy", function () {
        it("Should deploy", async function () {
            const MockERC20 = await ethers.getContractFactory("MockERC20");
            mockERC20 = await MockERC20.deploy();
            expect(mockERC20.address).to.not.be.undefined;
            console.log("mockERC20.address: ", mockERC20.address);

            const LenderVault = await ethers.getContractFactory("LenderVault");
            lenderVaultJunior = await LenderVault.deploy(mockERC20.address, 'Junior FILend FIL', 'jfFIL');
            expect(lenderVaultJunior.address).to.not.be.undefined;
            console.log("lenderVaultJunior.address: ", lenderVaultJunior.address);

            lenderVaultSenior = await LenderVault.deploy(mockERC20.address, 'Senior FILend FIL', 'sfFIL');
            expect(lenderVaultSenior.address).to.not.be.undefined;
            console.log("lenderVaultSenior.address: ", lenderVaultSenior.address);

            const LoanManager = await ethers.getContractFactory("LoanManager");
            loanManager = await LoanManager.deploy();
            expect(loanManager.address).to.not.be.undefined;
            console.log("loanManager.address: ", loanManager.address);

            const tx0 = await lenderVaultJunior.connect(owner).updateLoanManager(loanManager.address);
            expect(tx0).to.emit(lenderVaultJunior, 'LoanManagerUpdated').withArgs(loanManager.address);            
            const tx1 = await lenderVaultSenior.connect(owner).updateLoanManager(loanManager.address);
            expect(tx1).to.emit(lenderVaultSenior, 'LoanManagerUpdated').withArgs(loanManager.address);            
            const tx2 = await loanManager.connect(owner).updateLenderVaultJunior(lenderVaultJunior.address);
            expect(tx2).to.emit(loanManager, 'LenderVaultJuniorUpdated').withArgs(lenderVaultJunior.address);            
            const tx3 = await loanManager.connect(owner).updateLenderVaultSenior(lenderVaultSenior.address);
            expect(tx3).to.emit(loanManager, 'LenderVaultSeniorUpdated').withArgs(lenderVaultSenior.address);            
        });
    });

    describe("deposit", function () {
        it("Lenders should be able to deposit into vault", async function () {
            await mockERC20.connect(lender0).wrapAndApproveTo(lenderVaultJunior.address, {value: depositAmount0}); //wrap native token (tFIL) to test token and approve
            expect(await lenderVaultJunior.totalAssets()).to.equal(0);
            expect(await lenderVaultJunior.balanceOf(lender0.address)).to.equal(0);
            const tx0 = await lenderVaultJunior.connect(lender0).deposit(depositAmount0, lender0.address);
            expect(tx0).to.emit(lenderVaultJunior, 'Deposit').withArgs(lender0.address, lender0.address, depositAmount0);
            expect(await lenderVaultJunior.balanceOf(lender0.address)).to.equal(depositAmount0);
            expect(await lenderVaultJunior.virtualBalanceOf(lender0.address)).to.equal(depositAmount0);
            expect(await lenderVaultJunior.totalAssets()).to.equal(depositAmount0);

            await mockERC20.connect(lender1).wrapAndApproveTo(lenderVaultSenior.address, {value: depositAmount1}); //wrap native token (tFIL) to test token and approve
            expect(await lenderVaultSenior.balanceOf(lender1.address)).to.equal(0);
            const tx1 = await lenderVaultSenior.connect(lender1).deposit(depositAmount1, lender1.address);
            expect(tx1).to.emit(lenderVaultSenior, 'Deposit').withArgs(lender1.address, lender1.address, depositAmount1);
            expect(await lenderVaultSenior.balanceOf(lender1.address)).to.equal(depositAmount1);
            expect(await lenderVaultSenior.virtualBalanceOf(lender1.address)).to.equal(depositAmount1);
            expect(await lenderVaultSenior.totalAssets()).to.equal(depositAmount1);
        });
    });

    describe("addLoanRecord", function () {
        it("User should be able to add loan record", async function () {
            const lendingDate_ = Math.floor(new Date().getTime() / 1000);
            const repaymentDate_ = lendingDate_ + oneYear;
            const tx0 = await loanManager.connect(borrower2).addLoanRecord(borrower2.address, loanAmount2, oneYear, 0, 30, repaymentDate_, lendingDate_);
        });
    });

    describe("borrowFromVaultFor", function () {
        it("User should be able to borrow from loanManager", async function () {
            const tx0 = await loanManager.connect(borrower2).borrowFromVaultFor(1);
            expect(await mockERC20.balanceOf(borrower2.address)).to.equal(loanAmount2);
        });
    });

});