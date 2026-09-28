import { Link, useLocation } from "react-router-dom";

/** Links to a homepage section from any route: a plain hash on "/", a route + hash elsewhere. */
export function SectionLink({ id, children, ...rest }) {
  const { pathname } = useLocation();
  if (pathname === "/") {
    return (
      <a href={`#${id}`} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={`/#${id}`} {...rest}>
      {children}
    </Link>
  );
}
