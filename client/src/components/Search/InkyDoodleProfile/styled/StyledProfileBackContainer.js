import styled from "styled-components";

export const StyledProfileBackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 8px;
  top: 8px;
  background: transparent;
  padding: 0.5rem 1rem 0.5rem 1rem;
  margin: 0;
  color: #07c;
  border: 1px solid #07c;
  border-radius: 20px;
  font-size: 0.8rem;
  svg {
    path {
      fill: #07c;
    }
  }
  p {
    margin: 0;
    padding: 0 0 0 0.5rem;
    font-size: 0.5rem;
  }
  @media (min-width: 768px) {
    p {
      margin: 0;
      padding: 0 0 0 0.5rem;
      font-size: 0.8rem;
    }
  }
`;
