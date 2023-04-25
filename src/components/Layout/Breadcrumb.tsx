import { useMatches } from 'react-router-dom';
import styled from './Breadcrumb.module.scss';

export const Breadcrumb = () => {
  const matches = useMatches();
  const crumbs = matches
    .filter((match: any) => match.handle)
    .map((match: any) => match.handle.crumb(Number(match.params.detailId)));

  return (
    <ol className={styled.breadcrumbs}>
      {crumbs.map((crumb, index) => (
        <li className={styled.breadcrumbItem} key={index}>
          {crumb}
        </li>
      ))}
    </ol>
  );
};
