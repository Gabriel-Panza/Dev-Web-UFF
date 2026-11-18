import { createBrowserRouter, Navigate } from "react-router-dom";
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

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            // A linha abaixo define a rota “índice” (a rota padrão) dentro do grupo de rotas
            // filhas do caminho /. Ou seja, quando o usuário acessa exatamente /, ela redireciona 
            // automaticamente para /home.
            // - index: true marca essa rota como a padrão do pai.
            // - <Navigate to="/home" replace /> faz o redirecionamento.
            // - replace troca a entrada no histórico (o usuário não volta para / ao apertar “voltar”).
            {index: true, element: <Navigate to="/home" replace />},
            {path: "home", element: <HomePage />},
            {path: "carrinho", element: <CarrinhoPage />},
            {path: "listar-produtos", element: <ProdutosComPaginacaoPage />},
            {path: "produtos/:id", element: <ProdutoPage />},
            {path: "cadastrar-produto", element: <CadastrarProdutoPage />},
            {path: "login", element: <LoginPage />},
            {
                element: <PrivateRoutes />,
                children: [
                    {path: "favoritos", element: <FavoritosPage />},
                ]
            }
            // A página de erro já faz isso
            // {path: "*", element: <h5 className="text-xl text-center mt-3">404 - Página não encontrada</h5>}
        ]
    }
])
export default router;