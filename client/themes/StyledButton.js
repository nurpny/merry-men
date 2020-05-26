import styled from 'styled-components';

const StyledButton = styled.button`
  margin: 0px 10px;
  border-radius: 5px;
  color: white;
  background-color: ${(props) => props.buttonColor || 'black'};
`;

export { StyledButton };
