import React, {useState, useEffect} from 'react'
import { render } from '@testing-library/react'
import Decimal from "decimal.js-light";

import {ethers} from 'ethers'
import { Blockchain } from '../Blockchain/Blockchain.ts'
import MDVLTokenABI from '../Blockchain/abis/MDVLToken.json'

import {
  Gem,
  Square,
  Action,
  Transaction,
  ActionableItem,
  isGem,
  ACTIONABLE_ITEMS,
} from "../types/contract.ts";

import { GemItem, GEMS, getMarketGems } from "../types/gems.ts";

import {
  cacheAccountKingdom,
  getKingdom,
  getSelectedItem,
} from "../types/localStorage.ts";

import { Land } from "./Land.tsx";

import './Kingdom.css'


export const Kingdom: React.FC = () => {

    // - General
    const [provider, setProvider] = useState(null);
    const [blockchain, setBlockchain] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [connectButtonText, setConnectButtonText] = useState('Connect Wallet');
    // - User
    const accountId = React.useRef<string>();
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [originalBalance, setOriginalBalance] = useState(null);
    const [balance, setBalance] = useState(null);
    // - Kingdom
    const kingdomIsFresh = React.useRef(false);
    const [selectedItem, setSelectedItem] = React.useState<ActionableItem>(ACTIONABLE_ITEMS[0]);
    const [gems, setGems] = React.useState<GemItem[]>(GEMS);

    const miningSeconds = 0.25
    const miningTime = miningSeconds * 60

    const [land, setLand] = React.useState<Square[]>(
        Array(5).fill({ gem: Gem.None, createdAt: 0 })
    );



    // - Purpose: Set up General, Wallet, User, Kingdom, etc.
    // - Views: 'Connect Wallet' button
    const connectWalletHandler = () => {
        if (window.ethereum && defaultAccount == null){

            // Set Provider
            const ethersProvider = new ethers.providers.Web3Provider(window.ethereum)
            setProvider(ethersProvider);

            // Set Blockchain with Provider
            setBlockchain(new Blockchain(ethersProvider));

            // Connect to metamask
            window.ethereum.request({method: 'eth_requestAccounts'})
              .then(result => {
                  // Set ConnectButtonText
                  setConnectButtonText('Wallet Connected');

                  // Set Default Account as UserWalletAddress
                  const userWalletAddress = result[0];
                  setDefaultAccount(userWalletAddress);
                  accountId.current = userWalletAddress;
                  console.log("accountId.current", accountId.current);

                  // Set MDVL Balance
                  setMDVLBalance(ethersProvider, userWalletAddress);

                  // Set SelectedItem
                  const cachedItem = getSelectedItem(userWalletAddress);
                  setSelectedItem(cachedItem);

                  // Set Gems using Market rates
                  const marketRate = getMarketRate();
                  const marketGems = getMarketGems();
                  setGems(marketGems);
              })
              .catch(error => {
                  setErrorMessage(error.message);
              })
        }
        else if (!window.ethereum){
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension to interact')
        }
    }


    // - Caller: -> 'connectWalletHandler()'
    // - Purpose: Get the current wallet's MDVL balance
    const getMDVLBalance = async (provider, walletAddress) => {
      const abi = MDVLTokenABI;
      const tokenAddress = "0xC316BE1a6763056Abdbf838F208A87E6A263f393"; // MDVL Contract Address
      const contract = new ethers.Contract(tokenAddress, abi, provider);
      const balance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();
      const formattedBalance = ethers.utils.formatUnits(balance, decimals)
      return formattedBalance; // returns 1.0 rather than BigNumber
    };
    // - Caller: -> 'getMDVLBalance()'
    // - Purpose: Set our MDVL balance properties for use
    const setMDVLBalance = async (provider, walletAddress) => {
        getMDVLBalance(provider, walletAddress)
            .then((formattedBalance) => {
                console.log("formattedBalance", formattedBalance);
                setOriginalBalance(formattedBalance);
                setBalance(formattedBalance);
            })
            .catch(error => {
              setErrorMessage(error.message);
            })
    }


    // - Caller: -> src/Kingdom/Plot.tsx -> <Spot />
    // - Purpose: Define what actions to take when a user taps a spot to start mining
    const onMine = React.useCallback(

      async (landIndex: number) => {

        // Confirm that the item you are selecting is a valid 'Gem'
        if (!isGem(selectedItem)) {
          return;
        }

        // Confirm that the user's balance is greater than the cost of mining this gem.
        const price = gems.find((item) => item.gem === selectedItem.gem).minePrice;
        const balanceIsLessThanPrice = balance < price;
        if (balanceIsLessThanPrice) {
          return;
        }
        // Create transaction event to send to Blockchain.ts
        const now = Math.floor(Date.now() / 1000);
        const transaction: Transaction = {
          action: Action.Mine,
          gem: selectedItem.gem,
          landIndex,
          createdAt: now,
        };

        // Confirm blockchain exists and has been set. 
        // Then 
        // Append a new transaction event to Blockchain.ts 'events[]'
        if (blockchain){
            blockchain.addEvent(transaction);
        }

        // Set the land for the UI accordingly
        setLand((oldLand) => {
          const newLand = oldLand.map((field, index) => index === landIndex ? transaction : field);
          return newLand;
        });

        // Update Balance
        setBalance(balance - price);

      },
      [balance, selectedItem, gems]
    );

    // - Caller: -> src/Kingdom/Plot.tsx -> <Spot />
    // - Purpose: Define what actions to take when a user taps a spot to claim reward from mining
    const onClaim = React.useCallback(

      async (landIndex: number) => {

        // Confirm that the item you are selecting is a valid 'Gem'
        if (!isGem(selectedItem)) {
          return;
        }

        // Create transaction event to send to Blockchain.ts
        const now = Math.floor(Date.now() / 1000);
        const transaction: Transaction = {
          action: Action.Claim,
          gem: Gem.None,
          landIndex,
          createdAt: now,
        };
        console.log("transaction", transaction);

        // Confirm blockchain exists and has been set. 
        // Then 
        // Append a new transaction event to Blockchain.ts 'events[]'
        if (blockchain){
            blockchain.addEvent(transaction);
        }

        // Set the land for the UI accordingly
        setLand((oldLand) =>
          oldLand.map((field, index) => index === landIndex ? { gem: Gem.None, createdAt: 0 } : field)
        );

        // Update Balance
        const minedGem = land[landIndex];
        const price = gems.find((item) => item.gem === minedGem.gem).claimPrice;
        setBalance(balance + price);
        console.log("minedGem", minedGem);
      },
      [balance, gems, land]
    );


    // - Purpose: Initiate saving current session progress to the blockchain on src/Blockchain/Blockchain.ts
    // - Views: 'Withdraw Rewards 🦊' button
    const save = async () => {
        if (blockchain && balance && originalBalance){
            await blockchain.claimRewardsAndSave(balance, originalBalance);
        }
    };



// // // // // // // // // // // //// // // // // //// // // // // //// // // // // //// // // // // //// // // // // //// // // // // //// // // // // //

  return (
    <>
      <Land
        gems={gems}
        land={land}
        balance={balance}
        onMine={onMine}
        onClaim={onClaim}
        selectedItem={selectedItem}
        account={accountId.current}
      />

      <div id='wallet-card-container'>
          <h3>Welcome to your Kingdom 👑 ⚔️</h3>
          <button onClick={connectWalletHandler}>{connectButtonText}</button>
          <div className='accountDisplay'>
              <h3>Address: {defaultAccount}</h3>
          </div>
          <div className='balanceDisplay'>
              <h3>MDVL Balance: {balance}</h3>
          </div>
          <div>
              <button id='button-withdraw' onClick={save}>Withdraw Rewards 🦊</button>
          </div>
          {/* {errorMessage} */}
      </div>
    </>
  );
};

export default Kingdom;



