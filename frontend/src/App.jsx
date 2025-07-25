import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MediaViewer from "./components/mediaviewer";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MediaViewer />} />
      </Routes>
    </Router>
  );
};

export default App;
