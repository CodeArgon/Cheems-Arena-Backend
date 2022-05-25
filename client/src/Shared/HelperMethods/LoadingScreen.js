import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
const LoadingScreen = () => {
  return (
    <Box sx={{ display: "flex",justifyContent: "center",alignItems: "center",height: "100vh"}}>
      <CircularProgress sx={{color:"#B59B41"}}/>
    </Box>
  );
};

export default LoadingScreen;
