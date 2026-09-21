import dayjs from "dayjs";

const formatarData = (umaData: string | Date) => {
  if (!umaData) {
    throw new Error("Data inválida.");
  }
  return dayjs(umaData).format('DD/MM/YYYY');
}
export default formatarData;
