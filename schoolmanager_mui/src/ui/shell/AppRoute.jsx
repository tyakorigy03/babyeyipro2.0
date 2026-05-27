import { useParams } from "react-router-dom";
import AppContainer from "./AppContainer.jsx";

export default function AppRoute() {
  const { appId, pageId, entityId } = useParams();
  return (
    <AppContainer
      activeAppId={String(appId ?? "")}
      activePageId={String(pageId ?? "")}
      activeEntityId={String(entityId ?? "")}
    />
  );
}

