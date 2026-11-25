import headphonesImg from "@/assets/prod-headphones.jpg";
import keyboardImg from "@/assets/prod-keyboard.jpg";
import coffeeImg from "@/assets/prod-coffee.jpg";
import sneakersImg from "@/assets/prod-sneakers.jpg";
import lampImg from "@/assets/prod-lamp.jpg";
import backpackImg from "@/assets/prod-backpack.jpg";

export type CategoryId = "todos" | "eletronicos" | "casa" | "moda" | "acessorios";

export interface Product {
  id: string;
  title: string;
  category: Exclude<CategoryId, "todos">;
  categoryLabel: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  installments: number;
  freeShipping: boolean;
  fullDelivery: boolean;
  rating: number;
  reviewCount: number;
  soldCount: string;
  stock: number;
  image: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  seller: {
    name: string;
    level: string;
    sales: string;
    location: string;
  };
}

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "eletronicos", label: "Eletrônicos" },
  { id: "casa", label: "Casa & Café" },
  { id: "moda", label: "Moda" },
  { id: "acessorios", label: "Acessórios" },
];

export const PRODUCTS: Product[] = [
  {
    id: "fone-aura-anc",
    title: "Fone Over-Ear Aura ANC Wireless Verde Sálvia",
    category: "eletronicos",
    categoryLabel: "Eletrônicos",
    price: 299.99,
    originalPrice: 899.9,
    discountPercent: 23,
    installments: 12,
    freeShipping: true,
    fullDelivery: true,
    rating: 4.9,
    reviewCount: 412,
    soldCount: "+1,2 mil vendidos",
    stock: 18,
    image: headphonesImg,
    description:
      "Cancelamento ativo de ruído híbrido, acabamento em alumínio escovado e até 42 horas de autonomia para estudo, trabalho e viagens.",
    highlights: [
      "Cancelamento ativo de ruído (ANC) de 40 dB",
      "Bateria de até 42 horas com carregamento rápido USB-C",
      "Conexão multiponto Bluetooth 5.3",
    ],
    specs: [
      { label: "Conectividade", value: "Bluetooth 5.3 + Cabo P2" },
      { label: "Autonomia", value: "42 horas (ANC ligado: 30h)" },
      { label: "Peso", value: "254 g" },
      { label: "Garantia", value: "12 meses pelo fabricante" },
    ],
    seller: {
      name: "Aura Áudio Oficial",
      level: "MercadoLíder Platinum",
      sales: "+15 mil vendas",
      location: "São Paulo, SP",
    },
  },
  {
    id: "teclado-mecanico-botanic",
    title: "Teclado Mecânico Sem Fio Botanic 75% ABNT2",
    category: "eletronicos",
    categoryLabel: "Eletrônicos",
    price: 459.0,
    originalPrice: 579.0,
    discountPercent: 21,
    installments: 10,
    freeShipping: true,
    fullDelivery: true,
    rating: 4.8,
    reviewCount: 289,
    soldCount: "+850 vendidos",
    stock: 11,
    image: keyboardImg,
    description:
      "Layout compacto 75% com knob rotativo em alumínio, switches lineares lubrificados de fábrica e keycaps PBT em branco e verde floresta.",
    highlights: [
      "Tri-mode: Bluetooth 5.1, receptor 2.4 GHz e USB-C",
      "Switches hot-swappable silenciosos de fábrica",
      "Estrutura gasket mount para digitação macia",
    ],
    specs: [
      { label: "Formato", value: "75% (82 teclas + knob)" },
      { label: "Keycaps", value: "PBT Double-Shot" },
      { label: "Bateria", value: "4000 mAh recarregável" },
      { label: "Compatibilidade", value: "Windows, macOS e Linux" },
    ],
    seller: {
      name: "Kroma Periféricos",
      level: "MercadoLíder Gold",
      sales: "+6 mil vendas",
      location: "Curitiba, PR",
    },
  },
  {
    id: "chaleira-barista-gooseneck",
    title: "Chaleira Elétrica Pescoço de Ganso Barista 900ml",
    category: "casa",
    categoryLabel: "Casa & Café",
    price: 349.9,
    originalPrice: 429.9,
    discountPercent: 19,
    installments: 10,
    freeShipping: true,
    fullDelivery: false,
    rating: 4.9,
    reviewCount: 196,
    soldCount: "+500 vendidos",
    stock: 9,
    image: coffeeImg,
    description:
      "Controle preciso de fluxo para café coado V60 e chás especiais, corpo em aço inox fosco e base com ajuste de temperatura grau a grau.",
    highlights: [
      "Controle digital de 40°C a 100°C com função manter aquecido",
      "Bico pescoço de ganso para extração uniforme",
      "Desligamento automático e proteção contra fervura a seco",
    ],
    specs: [
      { label: "Capacidade", value: "900 ml" },
      { label: "Potência", value: "1200 W (127V ou 220V)" },
      { label: "Material", value: "Aço inox 304 fosco" },
      { label: "Peso", value: "1,15 kg" },
    ],
    seller: {
      name: "Atelier Café & Casa",
      level: "MercadoLíder Platinum",
      sales: "+9 mil vendas",
      location: "Belo Horizonte, MG",
    },
  },
  {
    id: "tenis-brisa-knit",
    title: "Tênis Casual Runner Brisa Knit Off-White & Esmeralda",
    category: "moda",
    categoryLabel: "Moda",
    price: 299.0,
    originalPrice: 389.0,
    discountPercent: 23,
    installments: 6,
    freeShipping: true,
    fullDelivery: true,
    rating: 4.7,
    reviewCount: 534,
    soldCount: "+2,4 mil vendidos",
    stock: 25,
    image: sneakersImg,
    description:
      "Cabedal em malha knit respirável sem costuras com entressola leve de EVA de alta absorção e detalhe em verde esmeralda no calcanhar.",
    highlights: [
      "Malha knit respirável que se ajusta ao formato do pé",
      "Solado anatômico ultraleve de 215 g",
      "Palmilha removível lavável com espuma de memória",
    ],
    specs: [
      { label: "Material externo", value: "Knit reciclado respirável" },
      { label: "Solado", value: "EVA expandido antiderrapante" },
      { label: "Indicação", value: "Dia a dia e caminhadas leves" },
      { label: "Numeração", value: "35 ao 44" },
    ],
    seller: {
      name: "Brisa Calçados",
      level: "MercadoLíder Platinum",
      sales: "+22 mil vendas",
      location: "Franca, SP",
    },
  },
  {
    id: "luminaria-mesa-norte",
    title: "Luminária de Mesa Articulada Norte LED + Base Carvalho",
    category: "casa",
    categoryLabel: "Casa & Café",
    price: 219.9,
    originalPrice: 279.9,
    discountPercent: 21,
    installments: 6,
    freeShipping: true,
    fullDelivery: false,
    rating: 4.8,
    reviewCount: 142,
    soldCount: "+400 vendidos",
    stock: 14,
    image: lampImg,
    description:
      "Design arquitetônico minimalista com braço articulável em metal verde sálvia fosco, base maciça em carvalho natural e dimmer touch.",
    highlights: [
      "3 temperaturas de cor (3000K, 4000K e 5000K)",
      "Iluminação sem cintilação (flicker-free) para leitura",
      "Base pesada em madeira natural com proteção antiderrapante",
    ],
    specs: [
      { label: "Fluxo luminoso", value: "650 lúmens (LED integrado)" },
      { label: "Altura máxima", value: "48 cm" },
      { label: "Alimentação", value: "Bivolt automático (100-240V)" },
      { label: "Acabamento", value: "Alumínio fosco + Carvalho" },
    ],
    seller: {
      name: "Norte Iluminação Studio",
      level: "MercadoLíder Gold",
      sales: "+4 mil vendas",
      location: "Florianópolis, SC",
    },
  },
  {
    id: "mochila-urbana-trilha",
    title: "Mochila Urbana Impermeável para Notebook 16\" Verde Oliva",
    category: "acessorios",
    categoryLabel: "Acessórios",
    price: 259.0,
    originalPrice: 329.0,
    discountPercent: 21,
    installments: 6,
    freeShipping: true,
    fullDelivery: true,
    rating: 4.9,
    reviewCount: 318,
    soldCount: "+1 mil vendidos",
    stock: 16,
    image: backpackImg,
    description:
      "Lona impermeável de alta densidade, compartimento acolchoado para notebook de até 16 polegadas e bolso lateral oculto antifurto.",
    highlights: [
      "Tecido resistente à chuva com zíperes selados foscos",
      "Divisória interna acolchoada para notebook até 16\"",
      "Alças ergonômicas respiráveis e faixa para mala de viagem",
    ],
    specs: [
      { label: "Capacidade", value: "22 litros" },
      { label: "Dimensões", value: "45 × 30 × 15 cm" },
      { label: "Material", value: "Poliéster 900D impermeável" },
      { label: "Peso", value: "780 g" },
    ],
    seller: {
      name: "Trilha Goods Oficial",
      level: "MercadoLíder Platinum",
      sales: "+11 mil vendas",
      location: "São Paulo, SP",
    },
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}