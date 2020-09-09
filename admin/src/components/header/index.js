import React from "react";
import styled from "styled-components";
import User from "./user";

export default () => {
  return (
    <div style={{ height: 70 }}>
      <Header>
        <User />
      </Header>
    </div>
  );
};

const Header = styled.div`
  padding: 15px;
  background-color: #284fa2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
`;
