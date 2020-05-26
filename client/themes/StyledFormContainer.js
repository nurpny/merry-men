import styled from 'styled-components';

const StyledFormContainer = styled.form`
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

  h1 {
    text-align: center;
    color: ${(props) => props.theme.colors.blue};
    text-transform: uppercase;
  }

  input {
    padding: 10px;
    margin: 5px 5px 0px 5px;
    box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
    border-radius: 5px;
    min-width: 300px;
  }

  button {
    margin: 20px 5px 20px 5px;
    border-radius: 5px;
  }
`;

export { StyledFormContainer };
