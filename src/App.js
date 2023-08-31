import React from "react";
import {RouterProvider} from "react-router-dom";
import {routes} from "./routes";
import {Box} from "@mui/material";

function App() {
  return (
    <Box className="App" style={{width: '100%'}}>
      <RouterProvider router={routes}/>
    </Box>
  );
}

export default App;
