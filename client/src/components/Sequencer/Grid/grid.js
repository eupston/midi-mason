import React from "react";
import Frame from "../Frame/frame";
import Cell from "../Cell/cell";

const Grid = (props) => (
  <Frame rows={props.totalTracks} columns={props.totalSteps}>
    {props.sequence.map((line, i) =>
      line.map((time, j) => (
        <Cell
          key={i + j}
          column={j + 1}
          row={i + 1}
          activated={props.sequence[i][j]["activated"]}
          triggered={props.sequence[i][j]["triggered"]}
          hovered={props.sequence[i][j]["hovered"]}
          onClick={() => props.toggleStep(i, j)}
          onMouseOver={() => props.hoverStep(i, j)}
          onMouseLeave={() => props.hoverOffStep(i, j)}
        />
      ))
    )}
  </Frame>
);

export default Grid;
