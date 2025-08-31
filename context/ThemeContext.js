import React, { useContext } from "react";

const ThemeContext = React.createContext();

const ThemeProvider = ThemeContext.Provider;
const ThemeConsumer = ThemeContext.Consumer;
const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, ThemeConsumer, useTheme };
