import { useState } from "react";
import { fetchAnalysis } from "../api/index";

export const useAnalysis = () => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);

  const runAnalysis = async (issueKey) => {
    setStatus("loading");
    try {
      const result = await fetchAnalysis(issueKey);
      setData(result);
      setStatus("success");
      return result;
    } catch (err) {
      console.error(err);
      setStatus("error");
      throw err;
    }
  };

  return { data, status, runAnalysis };
};
