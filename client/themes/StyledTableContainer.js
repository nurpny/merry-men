import styled from 'styled-components';

const StyledTableContainer = styled.section`
  display: flex;
  flex-direction: column;
  margin: 20px;

  h1 {
    color: ${(props) => props.theme.colors.blue};
  }

  table {
    border-collapse: separate;
    th {
      border-left: 1px solid ${(props) => props.theme.colors.lightgrey};
      border-bottom: 1px solid ${(props) => props.theme.colors.lightgrey};
      border-top: 1px solid ${(props) => props.theme.colors.lightgrey};
      padding: 5px;
    }
    td {
      border-bottom: 1px solid ${(props) => props.theme.colors.lightgrey};
      text-align: center;
      padding: 5px;
    }
    th: first-child {
      border-left: none;
    }
  }
`;

export { StyledTableContainer };
