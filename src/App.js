import CssBaseline from "@mui/material/CssBaseline";
import { Routes } from "./components/Routes";
import { useState } from "react";
import { SimpleBackdrop } from "./components/Loader";
function App() {
  const [open, setOpen] = useState(false);
  const handleOpen = (val) => setOpen(val);
  return (
    <div className="App">
      <CssBaseline />
      <SimpleBackdrop handleClose={open} />
      <Routes handleOpen={handleOpen} />
    </div>
  );
}

export default App;
