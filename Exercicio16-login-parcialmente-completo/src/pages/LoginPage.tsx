import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import useEfetuarLogin from "../hooks/useEfetuarLogin";
import useTokenStore from "../store/TokenStore";
import useLoginStore from "../store/LoginStore";

interface LoginForm {
  email: string;
  senha: string;
}

const LoginPage = () => {
  const [loginInvalido, setLoginInvalido] = useState(false);
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<LoginForm>();
  const {
    mutate: efetuarLogin,
    isPending: entrando,
    reset,
  } = useEfetuarLogin();
  const tokenResponse = useTokenStore((state) => state.tokenResponse);
  const setTokenResponse = useTokenStore((state) => state.setTokenResponse);
  const msg = useLoginStore((state) => state.msg);
  const setMsg = useLoginStore((state) => state.setMsg);
  const navigate = useNavigate();

  const limparMensagem = () => {
    setLoginInvalido(false);
    setMsg("");
    reset();
  };

  const tratarLogin = (dados: LoginForm) => {
    if (entrando) return;
    limparMensagem();
    // O roteiro chama o campo de email; o backend recebe essa informação como conta.
    efetuarLogin(
      { conta: dados.email.trim(), senha: dados.senha },
      {
        onSuccess: (resposta) => {
          if (!resposta.token || resposta.idUsuario === 0) {
            setLoginInvalido(true);
            setMsg("Login inválido.");
            return;
          }
          setTokenResponse(resposta);
          navigate("/home", { replace: true });
        },
        onError: (error) => setMsg(error.message),
      },
    );
    resetField("senha");
  };

  if (tokenResponse.token && tokenResponse.idUsuario > 0)
    return <Navigate to="/home" replace />;

  return (
    <>
      {/* sm ≥ 640px; md ≥ 768px; lg ≥ 1024px; xl ≥ 1280px; 2xl ≥ 1536px. */}
      <div className="mt-12 flex justify-center bg-white">
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-2xl duration-300">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Informe sua Conta e Senha
          </h2>
          {loginInvalido && (
            <div
              role="alert"
              className="mb-3 rounded border-2 border-red-600 bg-red-100 px-4 py-3 font-bold text-red-800"
            >
              Login inválido.
            </div>
          )}
          {msg && !loginInvalido && (
            <div
              role="alert"
              className="mb-3 rounded border-2 border-red-600 bg-red-100 px-4 py-3 font-bold text-red-800"
            >
              {msg}
            </div>
          )}
          <form
            onSubmit={handleSubmit(tratarLogin)}
            className="space-y-4"
            aria-busy={entrando}
          >
            <div>
              <label
                htmlFor="conta"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Conta
              </label>
              <input
                {...register("email", {
                  required: "Informe sua conta.",
                  validate: (value) => !!value.trim() || "Informe sua conta.",
                  onChange: limparMensagem,
                })}
                type="text"
                placeholder="Informe sua conta"
                id="conta"
                autoComplete="username"
                disabled={entrando}
                aria-invalid={!!errors.email}
                className="w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none hover:border-gray-500"
              />
              {errors.email && (
                <p role="alert" className="mt-1 text-sm text-red-800">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="senha"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                {...register("senha", {
                  required: "Informe sua senha.",
                  validate: (value) => !!value.trim() || "Informe sua senha.",
                  onChange: limparMensagem,
                })}
                type="password"
                placeholder="Informe sua senha"
                id="senha"
                autoComplete="current-password"
                disabled={entrando}
                aria-invalid={!!errors.senha}
                className="w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none hover:border-gray-500"
              />
              {errors.senha && (
                <p role="alert" className="mt-1 text-sm text-red-800">
                  {errors.senha.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end">
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="text-green-600 hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>
            <button
              type="submit"
              disabled={entrando}
              className="flex w-full cursor-pointer items-center justify-center rounded-md bg-green-600 py-2 font-semibold text-white duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {entrando && (
                <span
                  aria-hidden="true"
                  className="me-1 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                ></span>
              )}
              {entrando ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500">
            <span className="me-1">Não tem conta?</span>
            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="text-green-600 hover:underline"
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
