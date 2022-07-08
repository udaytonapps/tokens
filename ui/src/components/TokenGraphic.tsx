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
      color: "#DDCB6B",
      border: "4px dotted #CBB95A",
    },
    innerRim: {
      size: "250px",
      color: "#AA8500",
      border: "none",
    },
    inner: {
      size: "245px",
      color: "#CBB95A",
      border: "none",
    },
  },
  small: {
    fontSize: "18px",
    outerRim: {
      size: "30px",
      color: "#DDCB6B",
      border: "none",
    },
    innerRim: {
      size: "24px",
      color: "#AA8500",
      border: "none",
    },
    inner: {
      size: "22px",
      color: "#CBB95A",
      border: "none",
    },
  },
};

/** Show a graphic of a token */
function TokenGraphic(props: TokenGraphicProps) {
  const { count, size } = props;

  const stacked = size === "small" && count > 1;

  // SHADOW
  // BEVEL NUMBER
  const generateTokenStyles = (
    referenceKey: "outerRim" | "innerRim" | "inner"
  ) => {
    return {
      height: sizeReference[size][referenceKey].size,
      width: sizeReference[size][referenceKey].size,
      borderRadius: 50,
      border: sizeReference[size][referenceKey].border,
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
        border={sizeReference[size].outerRim.border}
      >
        <Box {...generateTokenStyles("innerRim")}>
          <Box {...generateTokenStyles("inner")}>{count}</Box>
        </Box>
      </Box>
      {stacked && (
        <Box
          {...generateTokenStyles("outerRim")}
          border={sizeReference[size].outerRim.border}
        >
          <Box {...generateTokenStyles("innerRim")}>
            <Box {...generateTokenStyles("inner")}></Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default TokenGraphic;
