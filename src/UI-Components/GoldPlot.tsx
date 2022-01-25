
import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers'
import './WalletCard.css'

import { Blockchain } from '../Blockchain/Blockchain.ts'
import { Action, Resource } from '../Blockchain/Blockchain.ts'
import { render } from '@testing-library/react'

import AbandonedGoldMine from '../images/mines/AbandonedGoldMine.png'
import FullGoldMine from '../images/mines/GoldMine.png'

import progressStart from "../images/progress/start.png";
import progressQuarter from "../images/progress/quarter.png";
import progressHalf from "../images/progress/half.png";
import progressAlmost from "../images/progress/almost.png";

import { secondsToString } from "../Blockchain/utils.ts";



interface InjectedValues {
  resource: Resource,
  action: Action;
  balance: number;
  square: Square;
  onClick: () => void;
}


function getTimeLeft(createdAt: number, totalTime: number) {
  const secondsElapsed = Date.now() / 1000 - createdAt;
  if (secondsElapsed > totalTime) {
    return 0;
  }

  return totalTime - secondsElapsed;
}


export const GoldPlot: React.FC<InjectedValues> = ({
  gems,
  selectedItem,
  balance,
  square,
  onClick,
}) => {
  const [_, setTimer] = React.useState<number>(0);

  const [claimPrice, setClaimPrice] = React.useState<string>(null);

  const [showPrice, setShowPrice] = React.useState(false);

  const [showInsufficientFunds, setShowInsufficientFunds] = React.useState(false);

  const gem = gems.find((item) => item.gem === square.gem);
  const totalTime = gem?.miningMinutes * 60;


// MARK: - click
  const click = React.useCallback(() => {
    if (!isGem(selectedItem)) {
      return;
    }
    // Show harvest price

    const gem = gems.find((item) => item.gem === square.gem);
    // Harvest
    if (gem) {
      setClaimPrice(`+${gem.claimPrice}`);
    } else {
      // Plant
      const buyGem = gems.find((item) => item.gem === selectedItem.gem);

      if (buyGem.minePrice > balance) {
        setShowInsufficientFunds(true);
        window.setTimeout(() => { setShowInsufficientFunds(false); }, 500);
        return;
      }

      setClaimPrice(`-${buyGem.minePrice}`);
    }

    setShowPrice(true);

    // Remove harvest price after X seconds
    window.setTimeout(() => {
      setShowPrice(false);
    }, 700);

    onClick();
  }, [balance, onClick, selectedItem, square.gem]);


  const setClaimTime = React.useCallback(() => {
    setTimer((count) => count + 1);
  }, []);


  React.useEffect(() => {
    if (square.gem && square.gem !== Gem.None) {
      setClaimTime();
      const interval = window.setInterval(setClaimTime, 1000);
      return () => window.clearInterval(interval);
    }
    /* eslint-disable */
  }, [square]);
  /* eslint-enable */


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

  const timeLeft = getTimeLeft(square.createdAt, totalTime);



  const miningGem = isGem(selectedItem) && gems.find((item) => item.gem === selectedItem.gem);







  return (

    <div onClick={!timeLeft ? click : undefined}>

           <div>
                <img id='goldmine' src={showFullGold_0 ? FullGoldMine : AbandonedGoldMine } onClick={plotIndex0TransactionHandler} />
            </div>

            <>
                {/* <img src={planted} className="planted-soil" /> */}
                {/* {timeLeft && timeLeft > 0 && Seedling()} */}
                {timeLeft && timeLeft > 0}
                {timeLeft === 0}
                {Progress()}
                {timeLeft && timeLeft > 0 && (
                    <span className="progress-text">{secondsToString(timeLeft)}</span>
                )}
            </>

    </div>
  );
};
