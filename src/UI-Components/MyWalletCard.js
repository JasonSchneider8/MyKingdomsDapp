import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers'
import './WalletCard.css'

import { Blockchain } from '../Blockchain/Blockchain.ts'
import { Action, Resource } from '../Blockchain/Blockchain.ts'
import { render } from '@testing-library/react'




const MyWalletCard = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [provider, setProvider] = useState(null);
    const [blockchain, setBlockchain] = useState(null);

    const miningSeconds = 0.25
    const miningTime = miningSeconds * 60


    const [showFullGold_0, setShowFullGold_0] = React.useState(false)
    const [showFullGold_1, setShowFullGold_1] = React.useState(false)
    const [showFullGold_2, setShowFullGold_2] = React.useState(false)
    const [showFullGold_3, setShowFullGold_3] = React.useState(false)


    // Progress
    const [_, setTimer] = React.useState<number>(0);


    const setClaimTime = React.useCallback(() => {
        setTimer((count) => count + 1);
    }, []);


    const timeLeft = getTimeLeft(square.createdAt, totalTime);


    const Progress = () => {
        if (timeLeft > totalTime * (3 / 4)) {
            return <img src={progressStart} className="progress" />;
        }

        if (timeLeft > totalTime * (1 / 2)) {
            return <img src={progressQuarter} className="progress" />;
        }

        if (timeLeft > totalTime * (1 / 4)) {
            return <img src={progressHalf} className="progress" />;
        }

        if (timeLeft > 0) {
            return <img src={progressAlmost} className="progress" />;
        }

        return null;
    };

  



// /// // / // / // / / / / // / /


    const connectWalletHandler = () => {
        if (window.ethereum && defaultAccount == null){
            // set ethers provider
            const ethersProvider = new ethers.providers.Web3Provider(window.ethereum)
            setProvider(ethersProvider);

            //const blockchain = ;
            setBlockchain(new Blockchain(ethersProvider));

            // connect to metamask
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                setConnButtonText('Wallet Connected');
                setDefaultAccount(result[0]);
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



    useEffect(() => {
        if (defaultAccount){
            provider.getBalance(defaultAccount)
            .then(balanceResult => {
                setUserBalance(ethers.utils.formatEther(balanceResult));
            })
        };
    }, [defaultAccount]);




    const plotIndex0TransactionHandler = () => {
        addTransaction(0)
     //   console.log('show full gold');
        if (showFullGold_0){
            setShowFullGold_0(false)
        } else {
            setShowFullGold_0(true)
        }
    }
    const plotIndex1TransactionHandler = () => {
        addTransaction(1)

        if (showFullGold_1){
            setShowFullGold_1(false)
        } else {
            setShowFullGold_1(true)
        }
    }
    const plotIndex2TransactionHandler = () => {
        addTransaction(2)

        if (showFullGold_2){
            setShowFullGold_2(false)
        } else {
            setShowFullGold_2(true)
        }
    }
    const plotIndex3TransactionHandler = () => {
        addTransaction(3)

        if (showFullGold_3){
            setShowFullGold_3(false)
        } else {
            setShowFullGold_3(true)
        }
    }


    function getTimeLeft(createdAt: number, totalTime: number) {
        const secondsElapsed = Date.now() / 1000 - createdAt;
        if (secondsElapsed > totalTime) {
            return 0;
        }   
        return totalTime - secondsElapsed;
    }



    async function addTransaction(plotIndex){
      console.log('Plottinnnnn');

      const now = Math.floor(Date.now() / 1000);

      const transaction = {
        action: Action.Plant,
        resource: Resource.MDVL,
        index: plotIndex,
        timestamp: now
      }

      if (blockchain){
        if (blockchain.events.length > 0){
            const itemsAtThisPlot = await (blockchain.events.filter(transaction => transaction.index == plotIndex));
            const itemsCount = itemsAtThisPlot.length;
            const alreadyExists = (itemsCount > 0);


            if (alreadyExists){
                const timeLeft = getTimeLeft(itemsAtThisPlot[itemsCount - 1].timestamp, miningTime);
                const stillTimeLeftUntilClaim = (timeLeft > 0.0);

                if (stillTimeLeftUntilClaim){
                    console.log("Already exists but have some time left until claimable:");
                    console.log('timeLeft', timeLeft);
                } 
                else {
                    console.log("Not the first transaction at this plot, but a new one");
                    blockchain.addEvent(transaction);
                }
            } 
            else {
                console.log("First transaction at plot #" + plotIndex.toString(), plotIndex);
                blockchain.addEvent(transaction);
            }    
        } 
        else {
            console.log("First transaction");
            blockchain.addEvent(transaction);
        }
      }

      console.log(blockchain.events);
    }


    const withdrawRewardsHandler = () => {
        //blockchain.sendToken();
        
        signTransaction();
    }



    async function signTransaction(){
      console.log('blockchain.provider', blockchain.provider);
    }





    return (
        <>

        <div className='walletCard'>
            <h4>Connection to MetaMask using ethers.js</h4>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <div className='accountDisplay'>
                <h3>Address: {defaultAccount}</h3>
            </div>
            <div className='balanceDisplay'>
                <h3>Balance: {userBalance}</h3>
            </div>

            {errorMessage}
        </div>


        <div className='walletCard'>
            <h1>Welcome to your Kingdom 👑 ⚔️</h1>
            <div>
                <button id='button-plot' onClick={plotIndex0TransactionHandler}>Plot 0</button>
                <button id='button-plot' onClick={plotIndex1TransactionHandler}>Plot 1</button>
                <button id='button-plot' onClick={plotIndex2TransactionHandler}>Plot 2</button>
                <button id='button-plot' onClick={plotIndex3TransactionHandler}>Plot 3</button>
            </div>

         
                
            <div>
                <button id='button-withdraw' onClick={withdrawRewardsHandler}>Withdraw Rewards 🦊</button>
            </div>
        </div>

        </>
    );
}

export default MyWalletCard;