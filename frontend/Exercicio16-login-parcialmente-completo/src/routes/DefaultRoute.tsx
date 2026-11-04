import { Navigate } from "react-router-dom";
import useTokenStore from "../store/TokenStore";
import estaAutenticado from "../util/estaAutenticado";

const DefaultRoute = () => {
  const tokenResponse = useTokenStore((state) => state.tokenResponse);
  return (
    <Navigate
      to={estaAutenticado(tokenResponse) ? "/home" : "/login"}
      replace
    />
  );
};

export default DefaultRoute;
