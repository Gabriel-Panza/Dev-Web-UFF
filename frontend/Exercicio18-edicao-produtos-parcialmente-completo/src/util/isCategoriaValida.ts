const isCategoriaValida = (categoria: number) => {
  // São as opções do select e da carga inicial do backend.
  return Number.isInteger(categoria) && [1, 2, 3].includes(categoria);
};
export default isCategoriaValida;
