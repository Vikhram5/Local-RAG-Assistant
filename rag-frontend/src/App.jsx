import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InputPage from "./InputPage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<InputPage />} />
        </Routes>
      </Router>
  );
}

export default App;