import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import api from "../services/api";
import { setUser } from "../redux/auth/actions";

export default ({ title }) => {
  const dispatch = useDispatch();

  return (
    <Header>
      <Title>{title}</Title>
      <Logout
        onClick={async () => {
          await api.post("/user/logout");
          dispatch(setUser(null));
        }}
      >
        Logout
      </Logout>
    </Header>
  );
};

const Header = styled.div`
  padding: 15px;
  background-color: #284fa2;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  color: #fff;
  font-size: 26px;
  font-weight: 800;
`;
const Logout = styled.div`
  padding: 8px 25px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  background-color: #1a3f8e;
`;
