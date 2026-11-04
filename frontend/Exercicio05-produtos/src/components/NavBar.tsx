import hortifruti from "../assets/hortifruti.png";

const NavBar = () => {
  return (
    <nav className="mb-6 bg-gray-100 py-4">
      <div className="mx-3 overflow-x-auto md:mx-10 lg:mx-20">
        <div className="flex min-w-max items-center justify-between gap-5">
          <div className="flex justify-between gap-5">
            <a href="/" aria-label="Página inicial">
              <img
                className="h-10 w-10 object-contain"
                src={hortifruti}
                alt="Logo"
              />
            </a>
            <a
              className="flex items-center gap-1 whitespace-nowrap text-gray-700 hover:text-black"
              aria-current="page"
              href="/"
            >
              <i className="bi bi-house"></i> Home
            </a>
            <a
              className="flex items-center gap-1 whitespace-nowrap text-gray-700 hover:text-black"
              href="/carrinho"
            >
              <i className="bi bi-cart3"></i> Carrinho
            </a>
            <a
              className="flex items-center gap-1 whitespace-nowrap text-gray-700 hover:text-black"
              href="/favoritos"
            >
              <i className="bi bi-heart"></i> Favoritos
            </a>
          </div>
          <div className="flex items-center gap-5">
            <a
              className="flex items-center gap-1 whitespace-nowrap text-gray-700 hover:text-black"
              href="/listar-produtos"
            >
              <i className="bi bi-card-list"></i> Listar Produtos
            </a>
            <a
              className="flex items-center gap-1 whitespace-nowrap text-gray-700 hover:text-black"
              href="/cadastrar-produto"
            >
              <i className="bi bi-database-add"></i> Cad. Produto
            </a>
            <a
              className="flex items-center gap-1 whitespace-nowrap text-gray-700 hover:text-black"
              href="/login"
            >
              <i className="bi bi-box-arrow-in-right"></i> Entrar
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
