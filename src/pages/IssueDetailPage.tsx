import { useEffect } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

export const IssueDetailPage = () => {
  const location = useLocation();
  const issueDetail: { id: string } | null = location.state;

  if (!issueDetail?.id) {
    return <Navigate to="/issues" />;
  }

  return <div>IssueDetailPage {issueDetail.id}</div>;
};
