import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// É preciso utilizar o plugin customParseFormat de dayjs.
dayjs.extend(customParseFormat);

const isDataValida = (umaData: string) => {
  // O true ativa validação estrita. Por exemplo, não irá aceitar 2025/06/12.
  // Para validar datas com formatos personalizados como YYYY-MM-DD, é preciso importar
  // e estender customParseFormat.
  return dayjs(umaData, "YYYY-MM-DD", true).isValid();
};
export default isDataValida;