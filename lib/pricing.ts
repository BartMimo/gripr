export function parseEuroPrice(price: string) {
  return Number(price.replace('€', '').replace(',', '.').trim())
}