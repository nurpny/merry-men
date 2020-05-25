import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    font: 400 14px Roboto, sans-serif;
  }


  a:link {
    color: ${(props) => props.theme.colors.blue};
  }

  a:visited {
    color: ${(props) => props.theme.colors.blue};
  }

  a:hover {
    color: ${(props) => props.theme.colors.blue};
  }

  a:active {
    color: ${(props) => props.theme.colors.blue};
  }

`;
