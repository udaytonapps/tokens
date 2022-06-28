import { Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./App.scss";
import DevPanel from "./components/DevPanel";
import Header from "./components/Header";
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
      </div>
    </ThemeProvider>
  );
}

export default App;
