import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  // useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./App.scss";
import DevPanel from "./components/DevPanel";
import Header from "./components/Header";
import { getInfo } from "./utils/api-connector";
import { AppContext } from "./utils/context";
import { getAppConfig, getEnvironment } from "./utils/helpers";
import { LtiAppInfo } from "./utils/types";
import InstructorView from "./views/InstructorView";

function App() {
  const [appConfig, setAppconfig] = useState<LtiAppInfo>();

  useEffect(() => {
    console.info(`Running in cra environment: ${getEnvironment()}`);
    getInfo().then((info) => {
      if (info && typeof info !== "string") {
        console.info(`Application configuration information retrieved`);
        /** Information about the environment used to create the react app */
        const config = getAppConfig(info);
        setAppconfig(config);
      } else {
        console.error("Unable to retrieve App Info - Session may be expired");
      }
    });
  }, []);

  /** An indication that the user has set (on a compatible browser) that they prefer dark mode */
  // const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  /** The default primary color (used if no other primary color is specified) */
  const defaultPrimary = useTheme().palette.primary.main;
  /** Theme customizations */
  const theme = createTheme({
    palette: {
      primary: {
        main: appConfig?.baseColor || defaultPrimary,
      },
      mode: appConfig?.darkMode ? "dark" : "light",
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: "bold",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {appConfig && (
          <AppContext.Provider value={appConfig}>
            <Box display={"flex"} className="App-header">
              <Box
                width={"100%"}
                p={4}
                height={"100vh"}
                display={"flex"}
                flexDirection={"column"}
              >
                <Header />
                <Box>
                  {/* Condition for views? */}
                  <InstructorView />
                </Box>
              </Box>
            </Box>
          </AppContext.Provider>
        )}
      </div>
      {/* Only show dev panel for local development */}
      {getEnvironment() === "pre_build" && <DevPanel />}
    </ThemeProvider>
  );
}

export default App;
