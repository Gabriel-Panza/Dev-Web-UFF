import { z } from "zod";
import isCategoriaValida from "../util/isCategoriaValida";
import isDataValida from "../util/isDataValida";

const regexImagem = /^[a-z]+\.(gif|jpg|png|bmp)$/;

const schema = z.object({
  nome: z
    .string()
    .trim()
    .nonempty({ message: "O 'nome' deve ser informado." })
    .min(3, { message: "O 'nome' deve ter pelo menos 3 caracteres." })
    .max(255, "O 'nome' deve ter no máximo 255 caracteres.")
    .refine(
      (val) => /\p{L}/u.test(val),
      "O 'nome' deve conter texto, podendo incluir números.",
    ),
  descricao: z
    .string()
    .trim()
    .nonempty("A 'descrição' deve ser informada.")
    .max(255, "A 'descrição' deve ter no máximo 255 caracteres."),
  categoria: z
    .number()
    .refine(isCategoriaValida, {
      message: "A 'categoria' deve ser informada.",
    }),
  data_cadastro: z
    .string()
    .nonempty("A 'data de cadastro' deve ser informada.")
    .refine(isDataValida, "Data inválida."),
  preco: z
    .string()
    .trim()
    .nonempty("O preço deve ser informado")
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val) && Number.isFinite(+val),
      "Informe um preço numérico com até duas casas decimais.",
    )
    .refine((val) => +val > 0.1, { message: "O 'preço' deve ser > 0,10" }),
  qtd_estoque: z
    .string()
    .trim()
    .nonempty("A 'quantidade em estoque' deve ser informada")
    .refine(
      (val) =>
        /^\d+$/.test(val) && Number.isSafeInteger(+val) && +val <= 2147483647,
      "A 'quantidade em estoque' deve ser um inteiro entre 0 e 2147483647.",
    ),
  imagem: z
    .string()
    .trim()
    .nonempty("A 'imagem' deve ser informada.")
    .max(255, "O nome da imagem deve ter no máximo 255 caracteres.")
    // O input permanece type="text", como no roteiro.
    .regex(regexImagem, { message: "Nome de imagem inválido." }),
  disponivel: z.boolean(),
});

export type ProdutoForm = z.infer<typeof schema>;
export default schema;
