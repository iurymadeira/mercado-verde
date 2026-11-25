export type PaymentMethod = "pix" | "card" | "boleto";

export const FREE_SHIPPING_THRESHOLD = 199;
export const STANDARD_SHIPPING_FEE = 19.9;
export const PIX_DISCOUNT_RATE = 0.05;

export interface CheckoutTotals {
  subtotal: number;
  shipping: number;
  pixDiscount: number;
  total: number;
}

export function calculateCheckoutTotals(
  subtotal: number,
  method: PaymentMethod,
): CheckoutTotals {
  const safeSubtotal = Math.max(0, subtotal);
  const shipping = safeSubtotal >= FREE_SHIPPING_THRESHOLD || safeSubtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const pixDiscount = method === "pix" ? Number((safeSubtotal * PIX_DISCOUNT_RATE).toFixed(2)) : 0;
  const total = Number(Math.max(0, safeSubtotal + shipping - pixDiscount).toFixed(2));
  return { subtotal: safeSubtotal, shipping, pixDiscount, total };
}

export function formatCep(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatCardExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export interface CheckoutFormInput {
  cep: string;
  street: string;
  number: string;
  city: string;
  method: PaymentMethod;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
}

export function validateCheckoutForm(input: CheckoutFormInput): string | null {
  if (input.cep.replace(/\D/g, "").length !== 8) {
    return "Informe um CEP válido com 8 dígitos.";
  }
  if (input.street.trim().length < 3) {
    return "Informe o endereço de entrega.";
  }
  if (input.number.trim().length === 0) {
    return "Informe o número do endereço.";
  }
  if (input.city.trim().length < 2) {
    return "Informe a cidade e estado.";
  }

  if (input.method === "card") {
    if (input.cardNumber.replace(/\D/g, "").length < 16) {
      return "Informe os 16 dígitos do cartão.";
    }
    if (input.cardName.trim().length < 3) {
      return "Informe o nome impresso no cartão.";
    }
    const expiryMatch = /^(\d{2})\/(\d{2})$/.exec(input.cardExpiry.trim());
    if (!expiryMatch) {
      return "Informe a validade no formato MM/AA.";
    }
    const month = Number(expiryMatch[1]);
    if (month < 1 || month > 12) {
      return "Mês de validade inválido.";
    }
    const cvvDigits = input.cardCvv.replace(/\D/g, "");
    if (cvvDigits.length < 3 || cvvDigits.length > 4) {
      return "Informe um CVV válido (3 ou 4 dígitos).";
    }
  }

  return null;
}

export function generateOrderCode(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `VM-${num}`;
}