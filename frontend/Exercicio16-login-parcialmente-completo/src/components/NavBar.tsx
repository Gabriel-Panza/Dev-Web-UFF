import { NavLink } from "react-router-dom";
import hortifruti from "../assets/hortifruti.png";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import useTokenStore from "../store/TokenStore";
import useLoginStore from "../store/LoginStore";

const NavBar = () => {
  const tokenResponse = useTokenStore((state) => state.tokenResponse);
  const setTokenResponse = useTokenStore((state) => state.setTokenResponse);
  const setMsg = useLoginStore((state) => state.setMsg);
  const logout = () => {
    setTokenResponse({ token: "", idUsuario: 0, nome: "", role: "" });
    setMsg("");
  };
  return (
    <nav className="mb-6 bg-gray-100 py-4">
      <div className="mx-3 md:mx-10 lg:mx-20">
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <NavLink to="/">
              <img src={hortifruti} width="45px" />
            </NavLink>
            <NavLink
              className="text-gray-700 hover:text-black"
              aria-current="page"
              to="/"
            >
              <i className="bi bi-house me-1"></i>
              Home
            </NavLink>
            <NavLink className="text-gray-700 hover:text-black" to="/carrinho">
              <i className="bi bi-cart3 me-1"></i>
              Carrinho
            </NavLink>
            <NavLink className="text-gray-700 hover:text-black" to="/favoritos">
              <i className="bi bi-heart me-1"></i>
              Favoritos
            </NavLink>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink
              className="text-gray-700 hover:text-black"
              to="/listar-produtos"
            >
              <i className="bi bi-card-list me-1"></i>
              Listar Produtos
            </NavLink>
            <NavLink
              className="text-gray-700 hover:text-black"
              to="/cadastrar-produto"
            >
              <i className="bi bi-database-add me-1"></i>
              Cad. Produto
            </NavLink>
            {tokenResponse.token && tokenResponse.idUsuario > 0 ? (
              <>
                <span className="text-gray-700">Olá, {tokenResponse.nome}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="cursor-pointer text-gray-700 hover:text-black"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Sair
                </button>
              </>
            ) : (
              <NavLink className="text-gray-700 hover:text-black" to="/login">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Entrar
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
