import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  // useMediaQuery,
  useTheme,
  // Snackbar,
  // Alert,
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
import LearnerView from "./views/LearnerView";

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

  // const getSnackBarAlert = () => {
  //   return <Alert severity="success">This is a success message!</Alert>;
  // };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={6000}
          open={true}
          message="Hello there"
        >
          {getSnackBarAlert()}
        </Snackbar> */}
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
                  {appConfig.isInstructor ? (
                    <InstructorView />
                  ) : (
                    <LearnerView />
                  )}
                </Box>
              </Box>
            </Box>
          </AppContext.Provider>
        )}
      </div>
      {/* Only show dev panel for local development */}
      {["pre_build", "local_build"].includes(getEnvironment()) && <DevPanel />}
    </ThemeProvider>
  );
}

export default App;
