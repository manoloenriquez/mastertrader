import React, { useEffect } from "react";
import App, { AppProps } from "next/app";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/css/ionicons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/scss/style.scss";

import { ThemeProvider } from "../context/ThemeContext";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { MarketProvider } from "../context/MarketContext";
import { DataProvider } from "../context/DataContext";

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  const [theme, setTheme] = useState(null);
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  useEffect(() => {
    const selectedTheme =
      theme === null ? window.localStorage.getItem("theme") ?? "dark" : theme;
    document.body.classList.toggle("dark", selectedTheme === "dark");

    window.localStorage.setItem("theme", selectedTheme);
    setTheme(selectedTheme);
  }, [theme]);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <MarketProvider>
        <DataProvider>
          <ThemeProvider
            value={{
              data: { theme },
              update: () => {
                setTheme(theme === "light" ? "dark" : "light");
              },
            }}
          >
            <Component {...pageProps} theme />
          </ThemeProvider>
        </DataProvider>
      </MarketProvider>
    </SessionContextProvider>
  );
}

// export default class MyApp extends App {
//   static async getInitialProps({ Component, ctx }) {
//     let pageProps = {};

//     if (Component.getInitialProps) {
//       pageProps = await Component.getInitialProps(ctx);
//     }

//     return { pageProps };
//   }

//   state = {
//     theme: "light",
//   };

//   render() {
//     const { Component, pageProps } = this.props;

//     return (
//       <ThemeProvider
//         value={{
//           data: this.state,
//           update: () => {
//             this.setState((state) => ({
//               theme:
//                 state.theme === "light"
//                   ? (this.theme = "dark")
//                   : (this.theme = "light"),
//             }));
//           },
//         }}
//       >
//         <Component {...pageProps} {...this.state} />
//       </ThemeProvider>
//     );
//   }
// }
