import { Box } from "@mui/material";

interface TokenGraphicProps {
  count: number;
  size: "small" | "large";
  disabled?: boolean;
}

const styleReference = {
  large: {
    color: "black",
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
    color: "black",
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
  disabled: {
    color: "#888",
    outerRim: {
      color: "#ccc",
    },
    innerRim: {
      color: "#aaa",
    },
    inner: {
      color: "#bbb",
    },
  },
};

/** Show a graphic of a token */
function TokenGraphic(props: TokenGraphicProps) {
  const { count, disabled, size } = props;

  const stacked = size === "small" && count > 1;

  // SHADOW
  // BEVEL NUMBER
  const generateTokenStyles = (
    referenceKey: "outerRim" | "innerRim" | "inner"
  ) => {
    return {
      height: styleReference[size][referenceKey].size,
      width: styleReference[size][referenceKey].size,
      borderRadius: 50,
      border: styleReference[size][referenceKey].border,
      sx: {
        backgroundColor: disabled
          ? styleReference.disabled[referenceKey].color
          : styleReference[size][referenceKey].color,
        fontSize: styleReference[size].fontSize,
        color: disabled
          ? styleReference.disabled.color
          : styleReference[size].color,
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
        border={styleReference[size].outerRim.border}
      >
        <Box {...generateTokenStyles("innerRim")}>
          <Box {...generateTokenStyles("inner")}>{count}</Box>
        </Box>
      </Box>
      {stacked && (
        <Box
          {...generateTokenStyles("outerRim")}
          border={styleReference[size].outerRim.border}
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
