const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { use, expect } = require("chai");

let accounts;
let owner, lender0, lender1, loanManager, lender3, lender4;
let depositAmount0, depositAmount1, depositAmount3, loanAmount2, paybackPrincipal2, paybackInterest2, lossPrincipal2, wrapAmount4;
let lockPeriod3;

let mockERC20;
let lenderVault;

before(async function () {
    // get accounts from hardhat
    accounts = await ethers.getSigners();
    owner = accounts[0];
    lender0 = accounts[0];
    lender1 = accounts[1];
    loanManager = accounts[2];
    lender3 = accounts[3];
    lender4 = accounts[4];
    depositAmount0 = ethers.utils.parseEther('100');
    depositAmount1 = ethers.utils.parseEther('100');
    depositAmount3 = ethers.utils.parseEther('100');
    loanAmount2 = ethers.utils.parseEther('10');
    paybackPrincipal2 = ethers.utils.parseEther('5');
    paybackInterest2 = ethers.utils.parseEther('5');
    lossPrincipal2 = ethers.utils.parseEther('2');
    lockPeriod3 = 100000;
    wrapAmount4 = ethers.utils.parseEther('500');
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
            // await mockERC20.faucet(lender0.address, depositAmount0);
            // await mockERC20.connect(lender0).approve(lenderVault.address, depositAmount0);
            await mockERC20.connect(lender0).wrapAndApproveTo(lenderVault.address, {value: depositAmount0}); //wrap native token (tFIL) to test token and approve
            expect(await lenderVault.totalAssets()).to.equal(0);
            expect(await lenderVault.balanceOf(lender0.address)).to.equal(0);
            const tx0 = await lenderVault.connect(lender0).deposit(depositAmount0, lender0.address);
            expect(tx0).to.emit(lenderVault, 'Deposit').withArgs(lender0.address, lender0.address, depositAmount0);
            expect(await lenderVault.balanceOf(lender0.address)).to.equal(depositAmount0);
            expect(await lenderVault.virtualBalanceOf(lender0.address)).to.equal(depositAmount0);
            expect(await lenderVault.totalAssets()).to.equal(depositAmount0);

            // await mockERC20.faucet(lender1.address, depositAmount1);
            // await mockERC20.connect(lender1).approve(lenderVault.address, depositAmount1);
            await mockERC20.connect(lender1).wrapAndApproveTo(lenderVault.address, {value: depositAmount1}); //wrap native token (tFIL) to test token and approve
            expect(await lenderVault.balanceOf(lender1.address)).to.equal(0);
            const tx1 = await lenderVault.connect(lender1).deposit(depositAmount1, lender1.address);
            expect(tx1).to.emit(lenderVault, 'Deposit').withArgs(lender1.address, lender1.address, depositAmount1);
            expect(await lenderVault.balanceOf(lender1.address)).to.equal(depositAmount1);
            expect(await lenderVault.virtualBalanceOf(lender1.address)).to.equal(depositAmount1);
            expect(await lenderVault.totalAssets()).to.equal(depositAmount0.add(depositAmount1));
        });
    });

    describe("redeem", function () {
        it("Lenders should be able to redeem from vault", async function () {
            const tx0 = await lenderVault.connect(lender0).redeem(depositAmount0, lender0.address, lender0.address);
            expect(tx0).to.emit(lenderVault, 'Withdraw').withArgs(lender0.address, lender0.address, lender0.address, depositAmount0, depositAmount0);
            expect(await lenderVault.balanceOf(lender0.address)).to.equal(0);
            expect(await lenderVault.virtualBalanceOf(lender0.address)).to.equal(0);
            expect(await mockERC20.balanceOf(lender0.address)).to.equal(depositAmount0);
        });
    });

    describe("updateLoanManager", function () {
        it("onlyOwner", async function () {
            const tx0 = lenderVault.connect(lender1).updateLoanManager(lender1.address);
            await expect(tx0).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("Owner should be able to updateLoanManager", async function () {
            const tx0 = lenderVault.connect(owner).updateLoanManager(loanManager.address);
            expect(tx0).to.emit(lenderVault, 'LoanManagerUpdated').withArgs(loanManager.address);            
        });
    });

    describe("borrowFromVault", function () {
        it("onlyLoanManager", async function () {
            const tx0 = lenderVault.connect(owner).borrowFromVault(loanAmount2, owner.address);
            await expect(tx0).to.be.revertedWith("onlyLoanManager");
        });
        it("loanManager should be able to borrow from vault", async function () {
            const tx0 = await lenderVault.connect(loanManager).borrowFromVault(loanAmount2, loanManager.address);
            expect(tx0).to.emit(lenderVault, 'LentOut').withArgs(loanAmount2, loanManager.address);
            expect(await lenderVault.totalLentOut()).to.equal(loanAmount2);
            expect(await mockERC20.balanceOf(loanManager.address)).to.equal(loanAmount2);
            expect(await lenderVault.virtualBalanceOf(lender1.address)).to.equal(depositAmount1);
        });
    });

    describe("numOfLenders", function () {
        it("Should return correct number of lenders", async function () {
            expect(await lenderVault.numOfLenders()).to.equal(2);
        });
    });

    describe("payBackToVault", function () {
        it("loanManager should be able to pay back to vault", async function () {
            await mockERC20.connect(loanManager).approve(lenderVault.address, paybackPrincipal2.add(paybackInterest2));
            const tx0 = await lenderVault.connect(loanManager).payBackToVault(paybackPrincipal2, paybackInterest2);
            expect(tx0).to.emit(lenderVault, 'Payback').withArgs(paybackPrincipal2, paybackInterest2);
            expect(await lenderVault.currentLentOut()).to.equal(loanAmount2.sub(paybackPrincipal2));
            expect(await lenderVault.virtualBalanceOf(lender1.address)).to.equal(depositAmount1.add(paybackInterest2));
        });
    });

    describe("realizePrincipalLoss", function () {
        it("loanManager should be able to put loss on vault", async function () {
            const tx0 = await lenderVault.connect(loanManager).realizePrincipalLoss(lossPrincipal2);
            expect(tx0).to.emit(lenderVault, 'PrincipalLoss').withArgs(lossPrincipal2);
            expect(await lenderVault.currentLentOut()).to.equal(loanAmount2.sub(paybackPrincipal2).sub(lossPrincipal2));
            expect(await lenderVault.virtualBalanceOf(lender1.address)).to.equal(depositAmount1.add(paybackInterest2).sub(lossPrincipal2));
        });
    });

    describe("deposit and redeem with lock period", function () {
        it("onlyOwner", async function () {
            const tx0 = lenderVault.connect(lender1).updateLockPeriod(0);
            await expect(tx0).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("Owner should be able to setDefaultLockPeriod", async function () {
            const tx0 = await lenderVault.connect(owner).updateLockPeriod(lockPeriod3);
            expect(tx0).to.emit(lenderVault, 'LockPeriodUpdated').withArgs(lockPeriod3);            
        });
        it("Lender should be able to deposit into vault", async function () {
            expect(await lenderVault.lockPeriod()).to.equal(lockPeriod3);
            //await mockERC20.faucet(lender3.address, depositAmount3);
            //await mockERC20.connect(lender3).approve(lenderVault.address, depositAmount3);
            await mockERC20.connect(lender3).wrapAndApproveTo(lenderVault.address, {value: depositAmount3}); //wrap native token (tFIL) to test token and approve
            expect(await lenderVault.balanceOf(lender3.address)).to.equal(0);
            const tx0 = await lenderVault.connect(lender3).deposit(depositAmount3, lender3.address);
            expect(tx0).to.emit(lenderVault, 'Deposit').withArgs(lender3.address, lender3.address, depositAmount3);
            const vb3 = await lenderVault.virtualBalanceOf(lender3.address);
            expect(Math.abs(depositAmount3.sub(vb3))).to.be.lessThan(2);
            const depositLockTillOf = await lenderVault.depositLockTillOf(lender3.address);
        });
        it("Lender should not be able to redeem from vault before lock period", async function () {
            const vb3 = await lenderVault.virtualBalanceOf(lender3.address);
            const tx0 = lenderVault.connect(lender3).withdraw(vb3, lender3.address, lender3.address);
            await expect(tx0).to.be.revertedWith("assets are locked");
        });
        it("Lender should not be able to redeem from vault after lock period", async function () {
            await helpers.time.increase(lockPeriod3 + 3600);
            const vb3 = await lenderVault.virtualBalanceOf(lender3.address);
            const tx0 = await lenderVault.connect(lender3).withdraw(vb3, lender3.address, lender3.address);
            expect(tx0).to.emit(lenderVault, 'Withdraw').withArgs(lender3.address, lender3.address, lender3.address, depositAmount3, depositAmount3);
            expect(await lenderVault.balanceOf(lender3.address)).to.equal(0);
            expect(await lenderVault.virtualBalanceOf(lender3.address)).to.equal(0);
            const withdrawAssets3 = await mockERC20.balanceOf(lender3.address)
            expect(Math.abs(depositAmount3.sub(withdrawAssets3))).to.be.lessThan(2);
        });
    });

    describe("Native token FIL", function () {
        it("should be able to wrap native token to test token", async function () {
            expect(await mockERC20.balanceOf(lender4.address)).to.equal(0);
            await mockERC20.connect(lender4).wrapAndApproveTo(lenderVault.address, {value: wrapAmount4});
            expect(await mockERC20.balanceOf(lender4.address)).to.equal(wrapAmount4);
        });
        it("should be able to unwrap test token to native token", async function () {
            await mockERC20.connect(lender4).unwrap(wrapAmount4);
            expect(await mockERC20.balanceOf(lender4.address)).to.equal(0);
        });
    });
});