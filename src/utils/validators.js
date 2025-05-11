// utils/validators.js
export function validarCUIT(cuit) {
  return /^\d{2}-\d{8}-\d{1}$/.test(cuit);
}
