import { NavLink } from "react-router-dom";
import hortifruti from "../assets/hortifruti.png";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import useTokenStore from "../store/TokenStore";
import useProdutoStore from "../store/useProdutoStore";
import type { Produto } from "../interfaces/Produto";

const NavBar = () => {
  const tokenResponse = useTokenStore((s) => s.tokenResponse);
  const setProdutoSelecionado = useProdutoStore((s) => s.setProdutoSelecionado);

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
              onClick={() => setProdutoSelecionado({} as Produto)}
              className="text-gray-700 hover:text-black"
              to="/cadastrar-produto"
            >
              <i className="bi bi-database-add me-1"></i>
              Cad. Produto
            </NavLink>
            <NavLink className="text-gray-700 hover:text-black" to="/login">
              {tokenResponse.idUsuario === 0 ? 
              <>
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Entrar
              </>
              :
              <>
                <i className="bi bi-box-arrow-left me-1"></i>
                Sair
              </>}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
