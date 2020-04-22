import React from "react";
import Frame from "./frame";
import Cell from "./cell";

const Grid = (props) => (
  <Frame rows={4} columns={8}>
    {props.sequence.map((line, i) =>
      line.map((time, j) => (
        <Cell
          key={i + j}
          column={j + 1}
          row={i + 1}
          activated={props.sequence[i][j]["activated"]}
          triggered={props.sequence[i][j]["triggered"]}
          onClick={() => props.toggleStep(i, j)}
        />
      ))
    )}
  </Frame>
);

export default Grid;
