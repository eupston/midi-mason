import React from "react";
import styled from "styled-components";

const Frame = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  grid-template-rows: repeat(${props => props.rows}, 1fr);
  width: 100%;
  height: calc(85vh - 60px);
  background:#28282c;

`;

export default Frame;
