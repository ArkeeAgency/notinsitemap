import { createTheme, darkTheme, KitchnProvider, lightTheme } from "kitchn";
import { AppProps } from "next/app";

import "kitchn/fonts.css";
import "@fontsource/jost";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <KitchnProvider
      themes={{
        light: createTheme({
          ...lightTheme,
          family: { primary: "Jost" },
        }),
        dark: createTheme({
          ...darkTheme,
          family: { primary: "Jost" },
        }),
      }}
    >
      <Component {...pageProps} />
    </KitchnProvider>
  );
};

export default App;
