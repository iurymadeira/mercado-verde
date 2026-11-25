import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Barcode,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Lock,
  MapPin,
  QrCode,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/data/products";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import {
  calculateCheckoutTotals,
  formatCardExpiry,
  formatCardNumber,
  formatCep,
  generateOrderCode,
  validateCheckoutForm,
  type PaymentMethod,
} from "@/lib/checkout";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Pagamento | Verde Market" },
      {
        name: "description",
        content: "Revise seu pedido e escolha a forma de pagamento simulada no Verde Market.",
      },
      { property: "og:title", content: "Pagamento | Verde Market" },
      {
        property: "og:description",
        content: "Revise seu pedido e escolha a forma de pagamento simulada no Verde Market.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const PIX_SAMPLE_CODE = "00020126580014BR.GOV.BCB.PIX0136verdemarket-academico-pix5204000053039865802BR";
const INPUT_CLASS =
  "h-11 w-full rounded-xl border border-input bg-surface-subtle px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 focus:outline-none";

function CheckoutPage() {
  const { user, hydrated } = useAuth();
  const { resolvedItems, subtotal, totalSavings, clearCart, setPendingCheckout } = useCart();
  const navigate = useNavigate();

  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState(1);
  const [copiedPix, setCopiedPix] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ code: string; total: number; method: PaymentMethod } | null>(
    null,
  );

  useEffect(() => {
    if (hydrated && !user && !confirmed) {
      setPendingCheckout(true);
      void navigate({ to: "/entrar" });
    }
  }, [hydrated, user, confirmed, setPendingCheckout, navigate]);

  const totals = useMemo(() => calculateCheckoutTotals(subtotal, method), [subtotal, method]);

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_SAMPLE_CODE);
      setCopiedPix(true);
      toast.success("Código Pix copiado!");
      setTimeout(() => setCopiedPix(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o código.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validateCheckoutForm({
      cep,
      street,
      number,
      city,
      method,
      cardNumber,
      cardName,
      cardExpiry,
      cardCvv,
    });
    if (validationError) {
      setError(validationError);
      return;
    }
    const code = generateOrderCode();
    setConfirmed({ code, total: totals.total, method });
    clearCart();
    toast.success(`Pedido #${code} confirmado (simulação)!`);
  };

  if (!hydrated || (!user && !confirmed)) {
    return null;
  }

  if (confirmed) {
    const methodLabel =
      confirmed.method === "pix"
        ? "Pix (5% de desconto)"
        : confirmed.method === "card"
          ? `Cartão de crédito (${installments}x sem juros)`
          : "Boleto bancário";
    return (
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <div className="animate-fade-up rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-soft text-primary">
            <CheckCircle2 className="size-9" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-foreground">Pagamento confirmado!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pedido <span className="font-semibold text-foreground">#{confirmed.code}</span> registrado para{" "}
            {user?.name}.
          </p>
          <div className="mt-6 space-y-2 rounded-xl bg-surface-subtle p-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Forma de pagamento</span>
              <span className="font-medium text-foreground">{methodLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total pago</span>
              <span className="font-bold text-primary">{formatBRL(confirmed.total)}</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Este é um protótipo acadêmico de frontend — nenhuma cobrança real foi realizada.
          </p>
          <Button asChild size="lg" className="mt-6 w-full rounded-full font-semibold">
            <Link to="/">Voltar para a loja</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (resolvedItems.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-14 text-center sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8">
          <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
          <h1 className="mt-4 text-lg font-bold text-foreground">Seu carrinho está vazio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Adicione produtos antes de prosseguir para o pagamento.
          </p>
          <Button asChild className="mt-6 rounded-full px-6">
            <Link to="/">Explorar produtos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Voltar para a loja
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Finalizar pagamento</h1>
          <p className="text-sm text-muted-foreground">
            Comprando como <span className="font-medium text-foreground">{user?.name}</span> ({user?.email})
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-soft-foreground">
          <Lock className="size-3.5 text-primary" />
          Checkout simulado
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="animate-fade-up rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
              <MapPin className="size-4 text-primary" />
              Endereço de entrega
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="checkout-cep" className="text-sm font-medium text-foreground">
                  CEP
                </label>
                <input
                  id="checkout-cep"
                  value={cep}
                  onChange={(e) => setCep(formatCep(e.target.value))}
                  placeholder="00000-000"
                  inputMode="numeric"
                  className={INPUT_CLASS}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="checkout-city" className="text-sm font-medium text-foreground">
                  Cidade / UF
                </label>
                <input
                  id="checkout-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo - SP"
                  className={INPUT_CLASS}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                  <div className="space-y-1.5">
                    <label htmlFor="checkout-street" className="text-sm font-medium text-foreground">
                      Rua / Avenida
                    </label>
                    <input
                      id="checkout-street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Av. Paulista"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="checkout-number" className="text-sm font-medium text-foreground">
                      Número
                    </label>
                    <input
                      id="checkout-number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="1000"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="animate-fade-up rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
              <CreditCard className="size-4 text-primary" />
              Forma de pagamento
            </h2>
            <div role="radiogroup" aria-label="Forma de pagamento" className="mt-4 grid gap-3 sm:grid-cols-3">
              {(
                [
                  { id: "pix", label: "Pix", sub: "5% de desconto", Icon: QrCode },
                  { id: "card", label: "Cartão", sub: "Até 12x sem juros", Icon: CreditCard },
                  { id: "boleto", label: "Boleto", sub: "Vence em 3 dias", Icon: Barcode },
                ] as const
              ).map(({ id, label, sub, Icon }) => {
                const selected = method === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setMethod(id);
                      setError(null);
                    }}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-all ${
                      selected
                        ? "border-primary bg-brand-soft/60 ring-2 ring-primary/20"
                        : "border-border bg-surface-subtle hover:border-primary/40"
                    }`}
                  >
                    <Icon className={`size-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                    <span className="text-xs text-muted-foreground">{sub}</span>
                  </button>
                );
              })}
            </div>

            {method === "pix" && (
              <div className="mt-5 rounded-xl bg-brand-soft/50 p-4">
                <p className="text-sm font-medium text-foreground">
                  Aprovação instantânea com 5% de desconto à vista.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Copie o código simulado abaixo ou clique em confirmar pagamento.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <code className="flex-1 truncate rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                    {PIX_SAMPLE_CODE}
                  </code>
                  <Button type="button" variant="outline" size="sm" onClick={handleCopyPix} className="shrink-0">
                    {copiedPix ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
                    {copiedPix ? "Copiado" : "Copiar"}
                  </Button>
                </div>
              </div>
            )}

            {method === "card" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="card-number" className="text-sm font-medium text-foreground">
                    Número do cartão
                  </label>
                  <input
                    id="card-number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    inputMode="numeric"
                    className={INPUT_CLASS}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="card-name" className="text-sm font-medium text-foreground">
                    Nome impresso no cartão
                  </label>
                  <input
                    id="card-name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="MARIANA SILVA"
                    className={INPUT_CLASS}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="card-expiry" className="text-sm font-medium text-foreground">
                    Validade
                  </label>
                  <input
                    id="card-expiry"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                    placeholder="MM/AA"
                    inputMode="numeric"
                    className={INPUT_CLASS}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="card-cvv" className="text-sm font-medium text-foreground">
                    CVV
                  </label>
                  <input
                    id="card-cvv"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    inputMode="numeric"
                    className={INPUT_CLASS}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="card-installments" className="text-sm font-medium text-foreground">
                    Parcelamento
                  </label>
                  <select
                    id="card-installments"
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className={INPUT_CLASS}
                  >
                    {[1, 2, 3, 6, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n}x de {formatBRL(totals.total / n)} sem juros
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {method === "boleto" && (
              <div className="mt-5 rounded-xl bg-surface-subtle p-4 text-sm text-muted-foreground">
                O boleto simulado será gerado com vencimento em 3 dias úteis assim que você confirmar o pedido.
              </div>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-foreground">Resumo do pedido</h2>
          <div className="mt-4 max-h-60 space-y-3 overflow-y-auto pr-1">
            {resolvedItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.title}
                  className="size-12 shrink-0 rounded-lg bg-surface-subtle object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{product.title}</p>
                  <p className="text-xs text-muted-foreground">Qtd: {quantity}</p>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatBRL(product.price * quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatBRL(totals.subtotal)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-shipping">
                <span>Economia em ofertas</span>
                <span>-{formatBRL(totalSavings)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Truck className="size-3.5 text-primary" />
                Frete
              </span>
              <span className={totals.shipping === 0 ? "font-semibold text-shipping" : ""}>
                {totals.shipping === 0 ? "Grátis" : formatBRL(totals.shipping)}
              </span>
            </div>
            {totals.pixDiscount > 0 && (
              <div className="flex justify-between text-shipping">
                <span>Desconto Pix (5%)</span>
                <span>-{formatBRL(totals.pixDiscount)}</span>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-border pt-3">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">{formatBRL(totals.total)}</span>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="mt-5 w-full rounded-full font-semibold transition-transform active:scale-[0.98]"
          >
            Confirmar pagamento
          </Button>
        </aside>
      </form>
    </div>
  );
}