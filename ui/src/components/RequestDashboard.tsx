import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { TokensSettings } from "../utils/types";
import RequestBalance from "./RequestBalance";
import RequestForm from "./RequestForm";

interface RequestDashboardProps {
  balance: number;
  settings: TokensSettings;
  refreshData: () => Promise<void>;
}

/** Where a learner can create/submit a request */
function RequestDashboard(props: RequestDashboardProps) {
  const { balance, settings, refreshData } = props;
  const [activeCount, setActiveCount] = useState(balance);

  useEffect(() => {
    setActiveCount(balance);
  }, [balance]);

  const resetBalance = () => {
    setActiveCount(balance);
  };

  return (
    <Box display={"flex"} justifyContent={"space-around"} pt={3}>
      <Box width={"55%"}>
        <RequestBalance balance={activeCount} />
      </Box>
      <Box width={"45%"}>
        <RequestForm
          balance={activeCount}
          updateBalance={setActiveCount}
          categories={settings.categories}
          resetBalance={resetBalance}
          refreshData={refreshData}
        />
      </Box>
    </Box>
  );
}

export default RequestDashboard;
