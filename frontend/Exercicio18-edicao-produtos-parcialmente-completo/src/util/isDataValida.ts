import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const isDataValida = (umaData: string) => {
  console.log("umaData = ", umaData);
  const resultado: boolean = dayjs(umaData, "YYYY-MM-DD", true).isValid();
  console.log(resultado);
  return resultado;
};
export default isDataValida;
