import { Box } from "@mui/material";

interface TokenGraphicProps {
  count: number;
  size: "small" | "large";
}

const sizeReference = {
  large: {
    fontSize: "150px",
    outerRim: {
      size: "300px",
      color: "#CBB95A",
    },
    innerRim: {
      size: "285px",
      color: "#AA8500",
    },
    inner: {
      size: "280px",
      color: "#DDCB6B",
    },
  },
  small: {
    fontSize: "18px",
    outerRim: {
      size: "30px",
      color: "#CBB95A",
    },
    innerRim: {
      size: "26px",
      color: "#AA8500",
    },
    inner: {
      size: "24px",
      color: "#DDCB6B",
    },
  },
};

/** Show a graphic of a token */
function TokenGraphic(props: TokenGraphicProps) {
  const { count, size } = props;

  const stacked = size === "small" && count > 1;

  const generateTokenStyles = (
    referenceKey: "outerRim" | "innerRim" | "inner"
  ) => {
    return {
      height: sizeReference[size][referenceKey].size,
      width: sizeReference[size][referenceKey].size,
      borderRadius: 50,
      sx: {
        backgroundColor: sizeReference[size][referenceKey].color,
        fontSize: sizeReference[size].fontSize,
        color: "black",
      },
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
  };

  return (
    <Box position={"relative"}>
      <Box
        {...generateTokenStyles("outerRim")}
        position={stacked ? "absolute" : "inherit"}
        left={stacked ? 5 : 0}
      >
        <Box {...generateTokenStyles("innerRim")}>
          <Box {...generateTokenStyles("inner")}>{count}</Box>
        </Box>
      </Box>
      {stacked && (
        <Box {...generateTokenStyles("outerRim")}>
          <Box {...generateTokenStyles("innerRim")}>
            <Box {...generateTokenStyles("inner")}></Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default TokenGraphic;
