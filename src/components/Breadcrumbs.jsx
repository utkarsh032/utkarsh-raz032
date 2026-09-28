import { Link } from "react-router-dom";

/** Visible breadcrumb trail; mirrors the BreadcrumbList structured data in seo.js. */
export function Breadcrumbs({ trail }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map(([name, to], i) => (
          <li key={to}>
            {i < trail.length - 1 ? <Link to={to}>{name}</Link> : <span aria-current="page">{name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
