import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
const Error = () => {
  return (
    <Wrapper>
      <h1>404</h1>
      <h3>Sorry, the page you tried can not be found</h3>
      <NavLink to="/">
        <button className="btn"> Back To Home</button>
      </NavLink>
    </Wrapper>
  );
};
const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--clr-primary-10);
  text-align: center;
  h1 {
    font-size: 10rem;
  }
  h3 {
    color: var(--clr-grey-3);
    margin-bottom: 1rem;
  }
`;
export default Error;
