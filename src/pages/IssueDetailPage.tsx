import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const IssueDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const issueDetail = location.state;
  console.log(issueDetail);
  useEffect(() => {
    if (!issueDetail) {
      navigate("/issues");
    }
  }, [issueDetail]);

  return <div>IssueDetailPage {issueDetail.id}</div>;
};
