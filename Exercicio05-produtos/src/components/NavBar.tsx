import hortifruti from "../assets/hortifruti.png";

const NavBar = () => {
  return (
    <nav className="w-full border-b border-[var(--border)]">
      <div className="overflow-x-auto px-4 py-2">
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
              className="flex items-center gap-1 whitespace-nowrap"
              aria-current="page"
              href="/"
            >
              <i className="bi bi-house"></i> Home
            </a>
            <a
              className="flex items-center gap-1 whitespace-nowrap"
              href="/carrinho"
            >
              <i className="bi bi-cart3"></i> Carrinho
            </a>
            <a
              className="flex items-center gap-1 whitespace-nowrap"
              href="/favoritos"
            >
              <i className="bi bi-heart"></i> Favoritos
            </a>
          </div>
          <div className="flex items-center gap-5">
            <a
              className="flex items-center gap-1 whitespace-nowrap"
              href="/listar-produtos"
            >
              <i className="bi bi-card-list"></i> Listar Produtos
            </a>
            <a
              className="flex items-center gap-1 whitespace-nowrap"
              href="/cadastrar-produto"
            >
              <i className="bi bi-database-add"></i> Cad. Produto
            </a>
            <a
              className="flex items-center gap-1 whitespace-nowrap"
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
