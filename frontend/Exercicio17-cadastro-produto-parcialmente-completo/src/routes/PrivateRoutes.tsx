import { Navigate, Outlet, useLocation } from "react-router-dom";
import useTokenStore from "../store/TokenStore";
import ehAdministrador from "../util/ehAdministrador";
import estaAutenticado from "../util/estaAutenticado";

interface Props {
  apenasAdmin?: boolean;
}

const PrivateRoutes = ({ apenasAdmin = false }: Props) => {
  const location = useLocation();
  const tokenResponse = useTokenStore((state) => state.tokenResponse);

  if (!estaAutenticado(tokenResponse)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (apenasAdmin && !ehAdministrador(tokenResponse)) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
};

export default PrivateRoutes;
