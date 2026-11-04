import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import CarrinhoPage from "../pages/CarrinhoPage";
import FavoritosPage from "../pages/FavoritosPage";
import HomePage from "../pages/HomePage";
import CadastrarProdutoPage from "../pages/CadastrarProdutoPage";
import LoginPage from "../pages/LoginPage";
import ErrorPage from "../pages/Errorpage";
import ProdutoPage from "../pages/ProdutoPage";
import ProdutosComPaginacaoPage from "../pages/ProdutosComPaginacaoPage";
import PrivateRoutes from "./PrivateRoutes";
import DefaultRoute from "./DefaultRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      // A rota índice escolhe home para logados e login para visitantes.
      { index: true, element: <DefaultRoute /> },
      { path: "home", element: <HomePage /> },
      { path: "carrinho", element: <CarrinhoPage /> },
      // {path: "listar-produtos", element: <ProdutosPage />},
      { path: "listar-produtos", element: <ProdutosComPaginacaoPage /> },
      {
        element: <PrivateRoutes />,
        children: [
          { path: "favoritos", element: <FavoritosPage /> },
          { path: "produtos/:id", element: <ProdutoPage /> },
          {
            element: <PrivateRoutes apenasAdmin />,
            children: [
              { path: "cadastrar-produto", element: <CadastrarProdutoPage /> },
            ],
          },
        ],
      },
      { path: "login", element: <LoginPage /> },
      // A página de erro já faz isso
      {
        path: "*",
        element: (
          <h5 className="mt-3 text-center text-xl">
            404 - Página não encontrada
          </h5>
        ),
      },
    ],
  },
]);
export default router;
