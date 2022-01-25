
import React from "react";

import { GemItem } from "../types/gems";
import { ActionableItem, Gem, isGem, Square } from "../types/contract.ts";
import { secondsToString } from "../types/utils.ts";

import "./Spot.css";

import progressStart from "../images/progress/start.png";
import progressQuarter from "../images/progress/quarter.png";
import progressHalf from "../images/progress/half.png";
import progressAlmost from "../images/progress/almost.png";

import selectBoxTL from "../images/select-box/selectbox_tl.png";
import selectBoxTR from "../images/select-box/selectbox_tr.png";
import selectBoxBR from "../images/select-box/selectbox_br.png";
import selectBoxBL from "../images/select-box/selectbox_bl.png";

import coin from "../images/ui/coin.png";
import planted from "../images/land/soil/planted.png";
import terrain from "../images/land/soil/soil.png";
import AbandonedGoldMine from '../images/mines/AbandonedGoldMine.png'
import FullGoldMine from '../images/mines/GoldMine.png'


function getTimeLeft(createdAt: number, totalTime: number) {
  const secondsElapsed = Date.now() / 1000 - createdAt;
  if (secondsElapsed > totalTime) {
    return 0;
  }

  return totalTime - secondsElapsed;
}


interface InjectedValues {
  gems: GemItem[];
  selectedItem: ActionableItem;
  balance: number;
  square: Square;
  onClick: () => void;
}


export const Spot: React.FC<InjectedValues> = ({
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




  const Seedling = () => {
    // TODO different plant seedlings
    if (square.gem === Gem.MDVL) {
      return <img src={AbandonedGoldMine} className="seedling" />;
    }
    return null;
  };

  const Plant = () => {
    // TODO different plant seedlings
    if (square.gem === Gem.MDVL) {
      return <img src={FullGoldMine} className="sunflower" />;
    }
    return null;
  };


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


  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  return (

    <div className="field" onClick={!timeLeft ? click : undefined}>

      {/* Briefly show Coin image and Gem price after clicking to 'mine'  */}
      <div className="harvest" style={{ opacity: !!showPrice ? "1" : "0" }}>
        <span className="harvest-amount">{claimPrice}</span>
        <img className="harvest-coin" src={coin} />
      </div>


      {/*  */}{/*  */}{/*  */}
 
      {/* Empty Spot ( Empty on load, or user just claimed reward from mine. ) */}
      {
        (square.gem === Gem.None) && (
          <>
            {!showPrice && ( <img className="plant-hint" src={miningGem.image} /> )}
            <img src={terrain} className="soil" />
          </>
        )
      }
      {/* Insufficient funds to mine */}
      {
        <span className="field-no-funds" style={{ opacity: !!showInsufficientFunds ? 1 : 0 }} >
            Insufficient funds
        </span>
      }
      {/* Currently Mining */}
      {
        (square.gem !== Gem.None) && (
          <>
            <img src={planted} className="planted-soil" />
            {timeLeft && timeLeft > 0 && Seedling()}
            {timeLeft === 0 && Plant()}
            {Progress()}
            {(timeLeft && timeLeft > 0) && (
              <span className="progress-text">{secondsToString(timeLeft)}</span>
            )}
          </>
        )
      }

      {/*  */}{/*  */}{/*  */}


      {/* Create 'select' square [ ] around Spots */}
      <div className="field-edges">
        <div>
          <img src={selectBoxTL} />
          <img src={selectBoxTR} />
        </div>
        <div>
          <img src={selectBoxBL} />
          <img src={selectBoxBR} />
        </div>
      </div>


    </div>
  );
};
