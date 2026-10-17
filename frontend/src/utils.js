export function money(value) {
  return new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 2 }).format(value || 0);
}

export function orderDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-ET', { dateStyle: 'medium', timeStyle: 'short' });
}
