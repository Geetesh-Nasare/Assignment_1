import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.light};
    color: ${props => props.theme.colors.dark};
    line-height: 1.6;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray[300]};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.gray[400]};
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  /* Button reset */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Link reset */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Input reset */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Image reset */
  img {
    max-width: 100%;
    height: auto;
  }

  /* List reset */
  ul, ol {
    list-style: none;
  }

  /* Table reset */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* Animation keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Utility classes */
  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .slide-in {
    animation: slideIn 0.3s ease-out;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  /* Responsive text */
  @media (max-width: 640px) {
    html {
      font-size: 14px;
    }
  }

  @media (min-width: 1024px) {
    html {
      font-size: 16px;
    }
  }
`;