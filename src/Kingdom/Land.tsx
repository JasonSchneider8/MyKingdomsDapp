import React from "react";

import { Square, Gem, ActionableItem } from "../types/contract";
import { GemItem } from "../types/gems";

import { Plot } from "./Plot.tsx";

import "./Land.css";

import waterEdge from "../images/water/edge.png";


const columns = Array(67).fill(null);
const rows = Array(28).fill(null);


interface InjectedValues {
  gems: GemItem[];
  land: Square[];
  balance: number;
  onMine: (landIndex: number) => void;
  onClaim: (landIndex: number) => void;
  selectedItem: ActionableItem;
  account?: string;
}


export const Land: React.FC<InjectedValues> = ({
  gems,
  land,
  balance,
  onMine,
  onClaim,
  selectedItem,
  account,
}) => {



  // // // // // // // // // // // //// // // // // //// // // // // //// // // // // //// // // // // //// // // // // //// // // // // //// // // // // //

  return (
    <>
      {columns.map((_, column) =>
        rows.map((_, row) =>
          (column + row) % 2 ? null : (
            <div
              className="grass1"
              style={{
                position: "absolute",
                left: `calc(${(column - 25) * 62.5}px + 18px)`,
                top: `${row * 62.5}px`,
                width: "62.5px",
                height: "62.5px",
                background: "#8C9019",
              }}
              key={column+row}
            />
          )
        )
      )}
      <div className="farm">

          <Plot
            gems={gems}
            selectedItem={selectedItem}
            land={land}
            balance={balance}
            onMine={onMine}
            onClaim={onClaim}
          />

      </div>

      {/* Water */}
      {new Array(42).fill(null).map((_, index) => (
        <img
          className="water-edge"
          src={waterEdge}
          style={{
            position: "absolute",
            left: `${index * 62.5}px`,
          }}
          key={index}
        />
      ))}

      <div id="water" />
    </>
  );
};
