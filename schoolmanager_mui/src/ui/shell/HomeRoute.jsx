import HomeRenderer from "../home/HomeRenderer.jsx";

/**
 * Route wrapper for home rendering (UI only).
 *
 * @param {{ home: unknown }} props
 */
export default function HomeRoute(props) {
  const { home } = props;
  return <HomeRenderer home={home} />;
}

