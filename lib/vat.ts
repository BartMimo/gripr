export const VAT_RATE = 0.21

export function calculateVat(amountExclVat: number) {
  return amountExclVat * VAT_RATE
}

export function calculateAmountInclVat(amountExclVat: number) {
  return amountExclVat * (1 + VAT_RATE)
}

export function formatEuro(amount: number) {
  return `€ ${amount.toFixed(2).replace('.', ',')}`
}