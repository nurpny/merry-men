import styled from 'styled-components';

const StyledTableContainer = styled.section`
  display: flex;
  flex-direction: column;
  margin: 20px;

  h1 {
    color: ${props => props.theme.colors.blue};
  }

  table {
    border-collapse: separate;
    th {
      border-left: 1px solid ${props => props.theme.colors.lightgrey};
      border-bottom: 1px solid ${props => props.theme.colors.lightgrey};
      border-top: 1px solid ${props => props.theme.colors.lightgrey};
    }
    td {
      border-bottom: 1px solid ${props => props.theme.colors.lightgrey};
      text-align: center;
    }
    th: first-child {
      border-left: none;
    }
  }
`

export { StyledTableContainer }
