import {
  Box,
  Card,
  ThemeProvider,
  Typography,
  Button,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { useEffect } from "react";
import "./App.scss";
import DevPanel from "./components/DevPanel";
import { DEFAULT_BASE_COLOR } from "./utils/contants";
import { getAppConfig } from "./utils/helpers";
import { CraEnvironment } from "./utils/types";
import InstructorView from "./views/InstructorView";

const environment =
  (process?.env.REACT_APP_ENV as CraEnvironment) || "production";
console.info("Running in cra environment: ", environment);

const theme = createTheme({
  palette: {
    primary: {
      main: getAppConfig().baseColor || DEFAULT_BASE_COLOR,
    },
    mode: getAppConfig().darkMode ? "dark" : "light",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* Only show dev panel for local development */}
        {environment === "pre_build" && <DevPanel environment={environment} />}
        <Box display={"flex"} className="App-header">
          <Box height={"100vh"} display={"flex"} flexDirection={"column"}>
            <Box>
              <InstructorView />
            </Box>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
