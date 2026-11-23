// Catálogo de la tienda. Precios en pesos, sin decimales.
// pack decide cómo se dibuja el empaque: 'bag' | 'box' | 'bottle' | 'hanger'

export const categories = [
  { id: 'alimento', label: 'Alimento' },
  { id: 'antiparasitarios', label: 'Antiparasitarios' },
  { id: 'higiene', label: 'Higiene' },
  { id: 'accesorios', label: 'Accesorios' },
]

export const products = [
  {
    id: 'alimento-perro-adulto-15',
    name: 'Alimento perro adulto razas medianas',
    category: 'alimento',
    species: 'Perro',
    brand: 'Campo Norte',
    size: '15 kg',
    detail: 'Pollo y arroz',
    price: 42990,
    pack: 'bag',
  },
  {
    id: 'alimento-gato-esterilizado-7',
    name: 'Alimento gato adulto esterilizado',
    category: 'alimento',
    species: 'Gato',
    brand: 'Campo Norte',
    size: '7,5 kg',
    detail: 'Salmón, control de peso',
    price: 34990,
    pack: 'bag',
  },
  {
    id: 'alimento-cachorro-pequeno-3',
    name: 'Alimento cachorro razas pequeñas',
    category: 'alimento',
    species: 'Perro',
    brand: 'Campo Norte',
    size: '3 kg',
    detail: 'Croqueta chica, cordero',
    price: 16990,
    pack: 'bag',
  },
  {
    id: 'antiparasitario-masticable-10-20',
    name: 'Antiparasitario externo masticable',
    category: 'antiparasitarios',
    species: 'Perro 10–20 kg',
    brand: 'Protec',
    size: '3 comprimidos',
    detail: 'Pulgas y garrapatas, 1 al mes',
    price: 29990,
    pack: 'box',
  },
  {
    id: 'pipeta-gato-4',
    name: 'Pipeta antipulgas para gato',
    category: 'antiparasitarios',
    species: 'Gato hasta 4 kg',
    brand: 'Protec',
    size: '3 pipetas',
    detail: 'Aplicación en la nuca',
    price: 18990,
    pack: 'box',
  },
  {
    id: 'shampoo-hipoalergenico-500',
    name: 'Shampoo hipoalergénico',
    category: 'higiene',
    species: 'Perro y gato',
    brand: 'Dermacalm',
    size: '500 ml',
    detail: 'Piel sensible, sin perfume',
    price: 9990,
    pack: 'bottle',
  },
  {
    id: 'arena-aglomerante-10',
    name: 'Arena sanitaria aglomerante',
    category: 'higiene',
    species: 'Gato',
    brand: 'Bentonita Sur',
    size: '10 kg',
    detail: 'Sin aroma, baja en polvo',
    price: 12990,
    pack: 'bag',
  },
  {
    id: 'correa-nylon-150',
    name: 'Correa de nylon reforzada',
    category: 'accesorios',
    species: 'Perro',
    brand: 'Paseo',
    size: '1,5 m',
    detail: 'Mosquetón de acero',
    price: 11990,
    pack: 'hanger',
  },
]

export function getProduct(id) {
  return products.find((p) => p.id === id)
}
