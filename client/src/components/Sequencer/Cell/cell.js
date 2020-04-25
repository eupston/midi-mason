import React from "react";
import styled from "styled-components";
import { darken } from "polished";

const getBackground = (activated, triggered, hovered) => {
  switch (true) {
    case hovered && !activated && !triggered:
      return "#42424a"
    case activated && triggered:
      return darken(0.2, "#0087ff");
    case activated && !triggered:
      return "#0087ff";
    case !activated && triggered:
      return "#42424a";
    default:
      return "#36363c";
  }
};

const getBoxShadow = (activated) => {
  switch (true) {
    case activated:
      return "0 0 10px 0 rgba(0,135,255,0.8)";
    default:
      return "0 1px 3px 0 rgba(0,0,0,0.3)";
  }
};

const Cell = styled.div.attrs(({ activated, triggered, hovered }) => ({
  style: {
    'background': getBackground(activated, triggered, hovered),
    'box-shadow': getBoxShadow(activated)
}
}))`
  border-radius: 10px;
  grid-column: ${props => props.column};
  grid-row: ${props => props.row};
  margin: 7px;
  transition:background .1s ease;
  &:hover {
    background: red; 
  }
`;


// const Cell = () => {
//   return (
//       <div className={classes.Cell}>
//
//       </div>
//   );
// };

export default Cell;
