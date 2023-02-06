<!-- @format -->

![image](https://user-images.githubusercontent.com/42178214/216841657-f0fc8553-abcf-42ea-b58e-d621c25ff61b.png)

# FILend

Decentralized undercollaterized lending protocol for Filecoin SPs. Lenders can stake their FIL to lending pools for SPs to borrow. SPs loan terms are based on lending pool characteristics and SP quality attributes. 
 
<br>


## Description

FILend is a decentralized undercollaterized lending protocol for Storage Providers (SPs) on the Filecoin network. It is well known that SPs do not have enough pledge collateral which limits both SP participation as well as the number of deals a SP is willing to do. While there are some well known centralized lending products such as CoinList or Anchorage, most FIL still sits on exchanges or wallets. 

<br> 

To help solve the SP liquidity issue we focused on creating an open, decentralized, permissionless lending protocol that allows lenders to stake their FIL for yield, and for SPs to borrow FIL.

<br> 

Our lending protocol is unique in multiple ways for both the lender and the borrower. The lender has the ability to stake to two different pools;

1) Senior Pool
2) Junior Pool. 

The Junior Pool returns a higher yield to the lender than the Senior Pool. However, in the edge cases that the pools need to be liquidated to cover a default on loans, the Junior Pool pays out the lenders before the Senior Pool. This paradigm allows lenders to stake their FIL at the risk they are comfortable with resulting in a higher probability that more lenders participate in the protocol. Finally, lenders can generate a higher yield on their FIL by proving they are contributing deals to the Filecoin network.

<br> 

Only SPs are able to borrow FIL from the pools and we verify that only SPs are able to request the pools for loans. SPs have to request a loan and the protocol underwrites programmatically. The rules are built into the protocol itself, so there are no humans determining whether an individual SP can receive a loan or not. Once we have authenticated and authorized a SP, they are put into a “Tier”. There are 5 Tiers (Tiers 1 - 5). Tier 5 SPs are not allowed to take loans from the protocol, while Tier 1 SPs are allowed the largest loans with the best rates. SPs are categorized into tiers based on the number of deals they have done, the % of deals that were completed, number of times they were slashed, if they are a FIL+ SP, and percentage of loans that a SP has borrowed that has been paid back to the protocol. These inputs are processed and then a loan is displayed to the SP. At this point, the SP is offered a loan, and the collateral they must put into a smart contract. If the loan and the loan terms are accepted by the SP, they deposit their collateral, and then the funds are transferred to the SP.

<br> 

SPs must be able to pay the protocol back, or malicious SPs will hijack the protocol to take money for themselves and never pay the protocol back. To combat this, we created a smart contract where the SP and protocol share the block rewards that SPs earn until the loan is paid off. Once the loan is paid off, the SP’s collateral is returned. The protocol also only allows a SP to borrow a certain amount of FIL at a time to make sure the protocol is not at risk due to one SP collapsing or defaulting on the loan. 


## TechStack

Tech stack: 
- FVM Hyperspace
- Hardhat
- Solidity
- openzeppelin
- figma
- next.js 
- ether.js
- Metamask 
- node.js
- express.js
<br>
Standard: ERC4626, ERC20

- Smart contract development was kick started with FEVM Hardhat Starter Kit. While hyperspace deployment works out of the box, it would be even better to make FVM to be testable on a local blockchain.

- Openzeppelin solidity library is used to enhance code quality.

- Senior and junior pools are ERC4626 based LenderVault contracts, to confront vault standards. 

- The FVM Solidity library seems not very mature yet in general, documentation is unclear and lacks end-to-end working examples.
The npm package of the library is buggy. Using the latest main branch source codes turn out to be much better in this case.
Our team had spent a lot of time on getting the MinerAPI.changeBeneficiary to work, but failed.
Seeked sponsor mentorship and the team help tagged someone in Zondax. Unfortunately, no one from the Zondax team was responding. 

- Frontend was first designed with figma, then built with next.js, integrated with FVM using ether.js and Metamask.

- Frontend dApp was deployed to Spheron (sponsor).


## Figma Designs
Link : https://www.figma.com/file/51fVYxckwjrOmvQkbX00RW/FVM-Hackathon?node-id=0%3A1&t=vzz1roWLAsavnkhd-1

## How to Run project

This is a Next.js (12) project .

change Directory
`cd front-end`

install packages
 `yarn or npm install`


Run front-end
`npm run dev or yarn dev`


## Express server 
deployed : https://vercel.com/umershaikh123/fil-lend-server/DG8BGELE9WzB7jeZ7P2AJ5d3BXvf

<br>

repo : https://github.com/umershaikh123/FilLendServer
