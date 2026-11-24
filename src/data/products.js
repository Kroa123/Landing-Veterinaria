// Catálogo de la tienda. Precios en pesos, sin decimales.
// muestra: reemplazar con datos reales (productos, marcas, precios y textos de este archivo)
//
// Campos de cada producto:
//   id            identificador estable (lo guarda el carrito en localStorage: no cambiarlo)
//   slug          URL del detalle: /tienda/<slug>
//   pack          cómo se dibuja el empaque (SVG y 3D): 'bag' | 'box' | 'bottle' | 'hanger'
//   detail        línea corta para la tarjeta
//   description   párrafo del detalle de producto
//   usage         modo de uso (lista de pasos cortos)
//   forWho        para quién es
//   presentation  peso / formato
//   featured      true: aparece en "Destacados" de Inicio

export const categories = [
  { id: 'alimento', label: 'Alimento' },
  { id: 'antiparasitarios', label: 'Antiparasitarios' },
  { id: 'higiene', label: 'Higiene' },
  { id: 'accesorios', label: 'Accesorios' },
]

export const products = [
  {
    id: 'alimento-perro-adulto-15',
    slug: 'alimento-perro-adulto-razas-medianas-15-kg',
    name: 'Alimento perro adulto razas medianas',
    category: 'alimento',
    species: 'Perro',
    brand: 'Campo Norte',
    size: '15 kg',
    detail: 'Pollo y arroz',
    price: 42990,
    pack: 'bag',
    featured: true,
    description:
      'Alimento seco completo para perros adultos de 10 a 25 kg. Pollo como primera proteína, arroz como fuente de energía y fibra para una digestión pareja. Es el que más recomendamos en consulta para perros sanos sin dietas especiales.',
    usage: [
      'Divide la ración diaria en dos comidas.',
      'Guíate por la tabla del envase según el peso ideal, no el actual.',
      'Si vienes de otro alimento, mézclalos durante 7 días.',
      'Deja siempre agua fresca disponible.',
    ],
    forWho: 'Perros adultos de 1 a 7 años, razas medianas (10 a 25 kg).',
    presentation: 'Saco de 15 kg con cierre resellable.',
  },
  {
    id: 'alimento-gato-esterilizado-7',
    slug: 'alimento-gato-adulto-esterilizado-7-5-kg',
    name: 'Alimento gato adulto esterilizado',
    category: 'alimento',
    species: 'Gato',
    brand: 'Campo Norte',
    size: '7,5 kg',
    detail: 'Salmón, control de peso',
    price: 34990,
    pack: 'bag',
    featured: true,
    description:
      'Fórmula con menos grasa y más fibra para gatos esterilizados, que tienden a subir de peso. Salmón como proteína principal y control de minerales para cuidar las vías urinarias.',
    usage: [
      'Sirve la ración diaria repartida en 2 a 4 porciones.',
      'Ajusta la cantidad si tu gato sube o baja de peso en el control.',
      'Haz el cambio de alimento de forma gradual, en una semana.',
      'Mantén el plato de agua lejos del arenero.',
    ],
    forWho: 'Gatos adultos esterilizados desde el año de edad.',
    presentation: 'Bolsa de 7,5 kg con cierre resellable.',
  },
  {
    id: 'alimento-cachorro-pequeno-3',
    slug: 'alimento-cachorro-razas-pequenas-3-kg',
    name: 'Alimento cachorro razas pequeñas',
    category: 'alimento',
    species: 'Perro',
    brand: 'Campo Norte',
    size: '3 kg',
    detail: 'Croqueta chica, cordero',
    price: 16990,
    pack: 'bag',
    description:
      'Croqueta pequeña y fácil de masticar, pensada para el crecimiento de cachorros de razas chicas. Cordero como proteína principal, con calcio y fósforo en la proporción que necesitan los huesos en desarrollo.',
    usage: [
      'Hasta los 4 meses, reparte la ración en 3 o 4 comidas.',
      'Desde los 4 meses, pasa a 2 o 3 comidas al día.',
      'Puedes humedecer la croqueta con agua tibia los primeros días.',
      'Pesa a tu cachorro cada mes para ajustar la ración.',
    ],
    forWho: 'Cachorros de 2 a 12 meses que de adultos pesarán menos de 10 kg.',
    presentation: 'Bolsa de 3 kg.',
  },
  {
    id: 'alimento-perro-senior-12',
    slug: 'alimento-perro-senior-12-kg',
    name: 'Alimento perro senior',
    category: 'alimento',
    species: 'Perro',
    brand: 'Campo Norte',
    size: '12 kg',
    detail: 'Pavo, articulaciones',
    price: 39990,
    pack: 'bag',
    description:
      'Alimento para perros mayores, con menos calorías y una croqueta más blanda. Incluye glucosamina y condroitina para acompañar el cuidado de las articulaciones.',
    usage: [
      'Divide la ración diaria en dos comidas.',
      'Si tu perro tiene dientes sensibles, remoja la croqueta 10 minutos.',
      'Haz el cambio de alimento de forma gradual, en una semana.',
      'Consulta en clínica si tiene alguna enfermedad renal o cardíaca.',
    ],
    forWho: 'Perros desde los 7 años, todas las razas.',
    presentation: 'Saco de 12 kg con cierre resellable.',
  },
  {
    id: 'snack-dental-perro',
    slug: 'snack-dental-perro-mediano',
    name: 'Snack dental para perro',
    category: 'alimento',
    species: 'Perro 10–25 kg',
    brand: 'Campo Norte',
    size: '7 unidades',
    detail: 'Uno al día, ayuda con el sarro',
    price: 6990,
    pack: 'bag',
    description:
      'Barritas con textura que ayuda a arrastrar la placa mientras tu perro mastica. Son un complemento del cepillado, no lo reemplazan.',
    usage: [
      'Da una barrita al día, idealmente después de comer.',
      'Descuéntala de la ración diaria si tu perro está a dieta.',
      'Supervisa a tu perro mientras la mastica.',
    ],
    forWho: 'Perros adultos de 10 a 25 kg.',
    presentation: 'Bolsa de 7 barritas.',
  },
  {
    id: 'antiparasitario-masticable-10-20',
    slug: 'antiparasitario-externo-masticable-perro-10-20-kg',
    name: 'Antiparasitario externo masticable',
    category: 'antiparasitarios',
    species: 'Perro 10–20 kg',
    brand: 'Protec',
    size: '3 comprimidos',
    detail: 'Pulgas y garrapatas, 1 al mes',
    price: 29990,
    pack: 'box',
    featured: true,
    description:
      'Comprimido masticable con sabor que protege contra pulgas y garrapatas durante un mes. La caja trae tres dosis, es decir, tres meses de protección para un perro de 10 a 20 kg.',
    usage: [
      'Da un comprimido cada 30 días, con o después de la comida.',
      'Confirma el peso de tu perro antes de comprar: la dosis depende de él.',
      'Anota la fecha en el carnet o en el calendario del teléfono.',
      'Si vomita dentro de la hora siguiente, consúltanos antes de repetir.',
    ],
    forWho: 'Perros de 10 a 20 kg, desde las 8 semanas de vida.',
    presentation: 'Caja con 3 comprimidos masticables.',
  },
  {
    id: 'pipeta-gato-4',
    slug: 'pipeta-antipulgas-gato-hasta-4-kg',
    name: 'Pipeta antipulgas para gato',
    category: 'antiparasitarios',
    species: 'Gato hasta 4 kg',
    brand: 'Protec',
    size: '3 pipetas',
    detail: 'Aplicación en la nuca',
    price: 18990,
    pack: 'box',
    description:
      'Pipeta de aplicación en la piel para gatos de hasta 4 kg. Protege contra pulgas durante cuatro semanas y no necesita que tu gato trague nada.',
    usage: [
      'Separa el pelo de la nuca hasta ver la piel.',
      'Aplica todo el contenido en un solo punto, donde no alcance a lamerse.',
      'No lo bañes en las 48 horas antes ni después.',
      'Repite cada 4 semanas.',
    ],
    forWho: 'Gatos de hasta 4 kg, desde las 8 semanas de vida.',
    presentation: 'Caja con 3 pipetas de 0,5 ml.',
  },
  {
    id: 'antiparasitario-interno-perro',
    slug: 'antiparasitario-interno-perro-comprimidos',
    name: 'Antiparasitario interno',
    category: 'antiparasitarios',
    species: 'Perro hasta 10 kg',
    brand: 'Protec',
    size: '2 comprimidos',
    detail: 'Lombrices, cada 3 meses',
    price: 7990,
    pack: 'box',
    description:
      'Comprimido para el control de parásitos intestinales en perros pequeños. Se usa cada tres meses o según el calendario que te indicamos en consulta.',
    usage: [
      'Da un comprimido por cada 10 kg de peso.',
      'Puedes esconderlo en un trozo de comida.',
      'Repite cada 3 meses en adultos.',
      'En cachorros, sigue el calendario que te entregamos en la consulta.',
    ],
    forWho: 'Perros de hasta 10 kg, desde las 2 semanas de vida.',
    presentation: 'Blíster con 2 comprimidos.',
  },
  {
    id: 'shampoo-hipoalergenico-500',
    slug: 'shampoo-hipoalergenico-500-ml',
    name: 'Shampoo hipoalergénico',
    category: 'higiene',
    species: 'Perro y gato',
    brand: 'Dermacalm',
    size: '500 ml',
    detail: 'Piel sensible, sin perfume',
    price: 9990,
    pack: 'bottle',
    featured: true,
    description:
      'Shampoo suave sin perfume ni colorantes, para pieles que se irritan con facilidad. Limpia sin resecar y deja el pelo fácil de desenredar.',
    usage: [
      'Moja bien todo el pelo con agua tibia.',
      'Aplica una cantidad pequeña y masajea 3 a 5 minutos.',
      'Enjuaga hasta que no quede espuma.',
      'Seca con toalla y evita el secador muy caliente.',
    ],
    forWho: 'Perros y gatos con piel sensible, desde los 3 meses.',
    presentation: 'Botella de 500 ml con tapa dosificadora.',
  },
  {
    id: 'arena-aglomerante-10',
    slug: 'arena-sanitaria-aglomerante-10-kg',
    name: 'Arena sanitaria aglomerante',
    category: 'higiene',
    species: 'Gato',
    brand: 'Bentonita Sur',
    size: '10 kg',
    detail: 'Sin aroma, baja en polvo',
    price: 12990,
    pack: 'bag',
    description:
      'Arena de bentonita que forma bolitas firmes al contacto con la orina, así sacas solo lo usado y el resto dura más. Sin aroma, para gatos que rechazan los perfumes.',
    usage: [
      'Llena el arenero con 5 a 7 cm de arena.',
      'Retira las bolitas y las heces todos los días.',
      'Completa con arena nueva cuando baje el nivel.',
      'Cambia todo el contenido y lava el arenero cada 3 o 4 semanas.',
    ],
    forWho: 'Gatos de todas las edades.',
    presentation: 'Bolsa de 10 kg.',
  },
  {
    id: 'correa-nylon-150',
    slug: 'correa-nylon-reforzada-1-5-m',
    name: 'Correa de nylon reforzada',
    category: 'accesorios',
    species: 'Perro',
    brand: 'Paseo',
    size: '1,5 m',
    detail: 'Mosquetón de acero',
    price: 11990,
    pack: 'hanger',
    description:
      'Correa de nylon doble con costuras reforzadas y mosquetón de acero que gira, para que no se enrede. El largo de 1,5 m sirve para paseos por la ciudad.',
    usage: [
      'Engancha el mosquetón a la argolla del collar o arnés.',
      'Revisa costuras y mosquetón cada cierto tiempo.',
      'Lávala a mano con agua y jabón neutro.',
    ],
    forWho: 'Perros de hasta 35 kg.',
    presentation: 'Correa de 1,5 m, ancho 2 cm.',
  },
  {
    id: 'collar-nylon-ajustable',
    slug: 'collar-nylon-ajustable-m',
    name: 'Collar de nylon ajustable',
    category: 'accesorios',
    species: 'Perro mediano',
    brand: 'Paseo',
    size: 'Talla M',
    detail: 'Cuello de 35 a 50 cm',
    price: 7990,
    pack: 'hanger',
    description:
      'Collar liviano con hebilla de cierre rápido y argolla metálica para la chapita y la correa. Se ajusta de 35 a 50 cm de cuello.',
    usage: [
      'Ajústalo de modo que quepan dos dedos entre el collar y el cuello.',
      'Revisa el ajuste cada mes si tu perro está creciendo.',
      'Agrega la chapita con su nombre y tu teléfono.',
    ],
    forWho: 'Perros medianos con cuello de 35 a 50 cm.',
    presentation: 'Collar talla M, ancho 2 cm.',
  },
]

export function getProduct(id) {
  return products.find((p) => p.id === id)
}

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug)
}

export function getCategory(id) {
  return categories.find((c) => c.id === id)
}

// Destacados para Inicio; si hay menos de los pedidos, completa con el resto del catálogo
export function getFeaturedProducts(limit = 4) {
  const featured = products.filter((p) => p.featured)
  const rest = products.filter((p) => !p.featured)
  return [...featured, ...rest].slice(0, limit)
}

// Relacionados: misma categoría primero, luego destacados. Nunca incluye el producto actual.
export function getRelatedProducts(product, limit = 4) {
  const others = products.filter((p) => p.id !== product.id)
  const same = others.filter((p) => p.category === product.category)
  const fill = others.filter((p) => p.category !== product.category && p.featured)
  const rest = others.filter((p) => p.category !== product.category && !p.featured)
  return [...same, ...fill, ...rest].slice(0, limit)
}
