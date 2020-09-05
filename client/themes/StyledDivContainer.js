import styled from 'styled-components';

const StyledDivContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.blue};
  border-radius: 5px;
  padding: 10px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  width: 350px;
`;

export { StyledDivContainer };
