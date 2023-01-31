require("hardhat-deploy")
require("hardhat-deploy-ethers")

const ethers = require("ethers")
const util = require("util")
const request = util.promisify(require("request"))
const { networkConfig } = require("../helper-hardhat-config")

const DEPLOYER_PRIVATE_KEY = network.config.accounts[0]

async function callRpc(method, params) {
    var options = {
        method: "POST",
        url: "https://api.hyperspace.node.glif.io/rpc/v1",
        // url: "http://localhost:1234/rpc/v0",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: 1,
        }),
    }
    const res = await request(options)
    return JSON.parse(res.body).result
}

const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY)

module.exports = async ({ deployments }) => {
    const { deploy } = deployments

    const priorityFee = await callRpc("eth_maxPriorityFeePerGas")
    
    // Wraps Hardhat's deploy, logging errors to console.
    const deployLogError = async (title, obj) => {
        let ret;
        try {
            ret = await deploy(title, obj);
        } catch (error) {
            console.log(error.toString())
            process.exit(1)
        }
        return ret;
    }

    console.log("Wallet Ethereum Address:", deployer.address)
    const chainId = network.config.chainId
    const tokenToBeMinted = networkConfig[chainId]["tokenToBeMinted"]


    await deployLogError("SimpleCoin", {
        from: deployer.address,
        args: [tokenToBeMinted],
        // maxPriorityFeePerGas to instruct hardhat to use EIP-1559 tx format
        maxPriorityFeePerGas: priorityFee,
        log: true,
    })

    await deployLogError("FilecoinMarketConsumer", {
        from: deployer.address,
        args: [],
        // maxPriorityFeePerGas to instruct hardhat to use EIP-1559 tx format
        maxPriorityFeePerGas: priorityFee,
        log: true,
    })

    await deployLogError("DealRewarder", {
        from: deployer.address,
        args: [],
        // maxPriorityFeePerGas to instruct hardhat to use EIP-1559 tx format
        maxPriorityFeePerGas: priorityFee,
        log: true,
    })

    const mockERC20 = await deployLogError("MockERC20", {
        from: deployer.address,
        args: [],
        // maxPriorityFeePerGas to instruct hardhat to use EIP-1559 tx format
        maxPriorityFeePerGas: priorityFee,
        log: true,
    })

    const lenderVaultJunior = await deployLogError("LenderVaultJunior", {
        contract: "LenderVault",
        from: deployer.address,
        args: [mockERC20.address,'flJFIL','flJFIL'],
        maxPriorityFeePerGas: priorityFee,
        log: true,
    })

    const lenderVaultSenior = await deployLogError("LenderVaultSenior", {
        contract: "LenderVault",
        from: deployer.address,
        args: [mockERC20.address,'flSFIL','flSFIL'],
        maxPriorityFeePerGas: priorityFee,
        log: true,
    })
}
