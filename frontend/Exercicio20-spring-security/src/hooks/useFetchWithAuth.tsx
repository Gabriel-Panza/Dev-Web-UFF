import { useLocation, useNavigate } from "react-router-dom";
import useLoginStore from "../store/LoginStore";
import useTokenStore from "../store/TokenStore";

export type FetchWithAuth = (url: string, options?: RequestInit) => Promise<Response>;
// options: method, headers, body, credentials e signal

const useFetchWithAuth = () => {
  // const setLoginInvalido = useLoginStore((s) => s.setLoginInvalido);
  const setMsg = useLoginStore((s) => s.setMsg);
  
  // const token = useTokenStore.getState().tokenResponse.token;
  // Para recuperar o token em uma única linha de código.

  const tokenResponse = useTokenStore((s) => s.tokenResponse);
  const setTokenResponse = useTokenStore((s) => s.setTokenResponse);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchWithAuth = async (url: string, options?: RequestInit) => {

    // RequestInit é o tipo padrão TypeScript (da API Fetch) para o segundo parâmetro
    // do fetch(url, options). Ele descreve as opções de uma requisição, como method, 
    // headers, body, credentials e signal.

    // credentials é usado, por exemplo, para enviar uma rquisição para o backend que
    // encaminha um refresh token através de um cookie httponly. O refresh token é 
    // utilizado para que um novo token seja criado quando o token atual expira. 
    // Cookies HttpOnly não podem ser lidos por código javascript reduzindo o dano de 
    // um ataque XSS.
    
    // E o signal é utilizado por exemplo, para cancelar uma busca quando o usuário 
    // sai da página ou digita outra pesquisa.
    
    const newHeaders = new Headers(options?.headers);

    if (tokenResponse.token != "") {
      newHeaders.set("Authorization", `Bearer ${tokenResponse.token}`);
    }

    options = { ...(options || {}), headers: newHeaders }; 
    // se options tiver headers, fica valendo o último (newHeaders)

    const response = await fetch(url, { ...options });

    if (!response.ok) {
      console.log("Ocorreu um erro com status = ", response.status);

      if (response.status === 401) {
        // setLoginInvalido(true);
        setMsg("Efetue login para acessar este recurso.");
        // Um token expirado retorna 401 assim como na ausência de token.
        setTokenResponse({ token: "", idUsuario: 0,  nome: "", role: "" });
        navigate("/login", {
          state: { destino: location.pathname + location.search + location.hash },
        });
        throw new Error("Efetue login para acessar este recurso.");
      } else if (response.status === 403) {
        // Para 403, o usuário não será redirecionado à tela de login e o token 
        // será mantido; a aplicação exibirá a página de erro com a mensagem de 
        // falta de permissão. 
        throw new Error("Sem permissão para acessar este recurso.");
      } else {
        // Se o conteúdo retornado for json não dará erro, caso contrário irá 
        // retornar null e como null é falsy será exibido Erro desconhecido.
        // E em que situações ocorre um erro que não retorna json. Por exemplo,
        // no caso do método recuperarProdutoPorId() cuja implemantação retornava:
        // return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        // Observe que e.getMessage() retorna um String e não um objeto com chave 
        // e valor. E há algumas outras situações que o backend retorna só o status,
        // isto é, não retorna um corpo. Exemplo: Erro 500 sem corpo.
        const error: unknown = await response.json().catch(() => null);
        // Usar unknown ou any na prática não muda nada em tempo de execução. A 
        // diferença está só no que o TypeScript permite fazer depois.
        // Com any, você poderia escrever error.message ou error.status sem nenhum 
        // aviso. Se o JSON não tiver esses campos, quebra só quando o código roda. 
        // Com unknown, o compilador bloqueia qualquer acesso a propriedades até 
        // você verificar o tipo (por exemplo, com isErrorResponse(error)). Aqui o 
        // código só faz if (error) throw error;, que é permitido com os dois tipos. 
        // Concluindo, é mais seguro usar unknown.
        if (error) throw error;  
        // Se error receber null (não foi retornado um json) será exibido: Erro 
        // desconhecido.
        throw new Error(("Erro desconhecido: ") + " - Status code: " + response.status);
      }
    }
    return response;
  };

  return { fetchWithAuth };
};
export default useFetchWithAuth;

