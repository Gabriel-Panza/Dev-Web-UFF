import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./Layout";
import CarrinhoPage from "../pages/CarrinhoPage";
import FavoritosPage from "../pages/FavoritosPage";
import HomePage from "../pages/HomePage";
import CadastrarProdutoPage from "../pages/CadastrarProdutoPage";
import LoginPage from "../pages/LoginPage";
import ProdutosPage from "../pages/ProdutosPage";
import ErrorPage from "../pages/ErrorPage";

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
            {path: "favoritos", element: <FavoritosPage />},
            {path: "listar-produtos", element: <ProdutosPage />},
            {path: "cadastrar-produto", element: <CadastrarProdutoPage />},
            {path: "login", element: <LoginPage />}
        ]
    }
])
export default router;
