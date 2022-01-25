
 import React from "react";

 import { GemItem } from "../types/gems.ts";
 import { ActionableItem, Gem, Square } from "../types/contract.ts";

 import { Spot } from "./Spot.tsx";



  interface InjectedValues {
    gems: GemItem[];
    selectedItem: ActionableItem;
    land: Square[];
    balance: number;
    onMine: (landIndex: number) => void;
    onClaim: (landIndex: number) => void;
  }




export const Plot: React.FC<InjectedValues> = ({
  gems,
  land,
  balance,
  onMine,
  onClaim,
  selectedItem,
}) => {
  
  const hasRendered = React.useRef(false);


  React.useEffect(() => {
    if (balance) {
      hasRendered.current = true;
    }
  }, [land, balance]);


  // // // // // // // // // // // //// // // // // //// // // // // //// // // // // //// // // // // //// // // // // //// // // // // //// // // // // //

  // - Spots Grid Indices
  //
  //        0
  //        |
  //    1 - 2 - 3
  //        |
  //        4
  //
  //
  
  return (
    <>
      {/* Create Dirt & Edges */}
      <div className="top-edge" style={{ gridColumn: "7/8", gridRow: "6/7" }} />
      <div className="top-edge" style={{ gridColumn: "8/9", gridRow: "6/7" }} />
      <div
        className="top-edge"
        style={{ gridColumn: "9/10", gridRow: "6/7" }}
      />
      <div className="dirt" style={{ gridColumn: "7/8", gridRow: "7/8" }} />
      <div className="dirt" style={{ gridColumn: "9/10", gridRow: "7/8" }} />



      {/* Spot 0 */}
      <div className="dirt" style={{ gridColumn: "8/9", gridRow: "7/8" }}>

          <Spot
            gems={gems}
            balance={balance}
            selectedItem={selectedItem}
            square={land[0]}
            onClick={
              land[0].gem === Gem.None ? () => onMine(0) : () => onClaim(0)
            }
          />

      </div>


      <div className="dirt" style={{ gridColumn: "7/8", gridRow: "8/9" }}>
        
          <Spot
            gems={gems}
            balance={balance}
            selectedItem={selectedItem}
            square={land[1]}
            onClick={
              land[1].gem === Gem.None ? () => onMine(1) : () => onClaim(1)
            }
          />

      </div>


      <div
        id="first-sunflower"
        className="dirt"
        style={{ gridColumn: "8/9", gridRow: "8/9" }}
      >
          <Spot
            gems={gems}
            balance={balance}
            selectedItem={selectedItem}
            square={land[2]}
            onClick={
              land[2].gem === Gem.None ? () => onMine(2) : () => onClaim(2)
            }
          />

      </div>


      <div className="dirt" style={{ gridColumn: "9/10", gridRow: "8/9" }}>

          <Spot
            gems={gems}
            balance={balance}
            selectedItem={selectedItem}
            square={land[3]}
            onClick={
              land[3].gem === Gem.None ? () => onMine(3) : () => onClaim(3)
            }
          />

      </div>


      <div className="dirt" style={{ gridColumn: "8/9", gridRow: "9/10" }}>

          <Spot
            gems={gems}
            balance={balance}
            selectedItem={selectedItem}
            square={land[4]}
            onClick={
              land[4].gem === Gem.None ? () => onMine(4) : () => onClaim(4)
            }
          />

      </div>


    


      {/* Create Dirt & Edges */}
      <div className="dirt" style={{ gridColumn: "7/8", gridRow: "9/10" }} />
      <div className="dirt" style={{ gridColumn: "9/10", gridRow: "9/10" }} />
  
      <div
        className="bottom-edge"
        style={{ gridColumn: "7/8", gridRow: "10/11" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "8/9", gridRow: "10/11" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "9/10", gridRow: "10/11" }}
      />

      <div
        className="left-edge"
        style={{ gridColumn: "6/7", gridRow: "7/8" }}
      />
      <div
        className="left-edge"
        style={{ gridColumn: "6/7", gridRow: "9/10" }}
      />

      <div
        className="right-edge"
        style={{ gridColumn: "10/11", gridRow: "7/8" }}
      />
      <div
        className="right-edge"
        style={{ gridColumn: "10/11", gridRow: "8/9" }}
      />
      <div
        className="right-edge"
        style={{ gridColumn: "10/11", gridRow: "9/10" }}
      />
    </>
  );
};






