import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { IssueDetailPage } from "./pages/IssueDetailPage";
import { IssuesPage } from "./pages/IssuesPage";
import { LoginPage } from "./pages/LoginPage";
import { AccessTokenContext } from "@src/context/useTokenContext";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AccessTokenContext.Provider value={accessToken}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/issues"
          element={<IssuesPage setAccessToken={setAccessToken} />}
        />
        <Route path="/issues/detail/:detailId" element={<IssueDetailPage />} />
      </Routes>
    </AccessTokenContext.Provider>
  );
}

export default App;
