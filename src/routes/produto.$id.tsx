import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  Check,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatBRL, getProductById, PRODUCTS } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/produto/$id")({
  head: ({ params }) => {
    const product = getProductById(params.id);
    const title = product ? `${product.title} | Verde Market` : "Produto não encontrado | Verde Market";
    const description = product
      ? product.description
      : "Confira outros produtos disponíveis no Verde Market.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const product = getProductById(id);
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-foreground">Produto não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O anúncio que você procurou não está mais disponível no Verde Market.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para a vitrine
        </Link>
      </div>
    );
  }

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addItem(product.id, quantity);
    toast.success(`${quantity}x ${product.title} adicionado ao carrinho`);
  };

  const handleBuyNow = () => {
    addItem(product.id, quantity);
    openCart();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Voltar para a vitrine
      </Link>

      <div className="animate-fade-up mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-subtle">
            <img src={product.image} alt={product.title} className="aspect-[4/3] w-full object-cover" />
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Sobre este produto</h2>
            <p className="leading-relaxed text-muted-foreground">{product.description}</p>
            <ul className="space-y-2 pt-1">
              {product.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3 border-t border-border pt-6">
            <h2 className="text-lg font-bold text-foreground">Características técnicas</h2>
            <dl className="divide-y divide-border rounded-2xl border border-border bg-card">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
                  <dt className="font-medium text-muted-foreground">{spec.label}</dt>
                  <dd className="font-medium text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="space-y-5 lg:col-span-5">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs text-muted-foreground">Novo • {product.soldCount}</p>
            <h1 className="mt-2 text-2xl font-bold leading-tight text-foreground">{product.title}</h1>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <Star className="size-4 fill-rating text-rating" />
                {product.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">({product.reviewCount} avaliações)</span>
            </div>

            <div className="mt-5 space-y-1">
              <p className="text-sm text-muted-foreground line-through">
                {formatBRL(product.originalPrice)}
              </p>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-extrabold tracking-tight text-foreground">
                  {formatBRL(product.price)}
                </span>
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand-soft-foreground">
                  {product.discountPercent}% OFF
                </span>
              </div>
              <p className="text-sm font-medium text-shipping">
                em até {product.installments}x de {formatBRL(product.price / product.installments)}{" "}
                sem juros
              </p>
            </div>

            <div className="mt-5 space-y-2.5 rounded-xl bg-surface-subtle p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold text-shipping">
                <Truck className="size-4 shrink-0" />
                <span>Frete grátis para todo o Brasil</span>
                {product.fullDelivery && (
                  <span className="inline-flex items-center gap-0.5 rounded bg-brand-soft px-1.5 py-0.5 text-[11px] font-bold text-brand-soft-foreground">
                    <Zap className="size-3 fill-current" />
                    FULL
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0 text-primary" />
                <span>Compra Garantida — receba o produto ou seu dinheiro de volta.</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Quantidade{" "}
                <span className="font-normal text-muted-foreground">
                  ({product.stock} disponíveis)
                </span>
              </span>
              <div className="flex items-center rounded-full border border-border bg-surface-subtle">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Diminuir quantidade"
                  className="flex size-9 items-center justify-center rounded-l-full text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="min-w-9 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Aumentar quantidade"
                  className="flex size-9 items-center justify-center rounded-r-full text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <Button
                size="lg"
                onClick={handleBuyNow}
                className="w-full rounded-full font-semibold transition-transform active:scale-[0.98]"
              >
                Comprar agora
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleAddToCart}
                className="w-full rounded-full font-semibold transition-transform active:scale-[0.98]"
              >
                Adicionar ao carrinho
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-bold text-foreground">Informações do vendedor</h2>
            <div className="mt-3 flex items-center gap-2 text-primary">
              <Award className="size-4 shrink-0" />
              <span className="text-sm font-semibold">{product.seller.level}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">{product.seller.name}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              {product.seller.location} • {product.seller.sales}
            </p>

            <div className="mt-4 grid grid-cols-5 gap-1.5" aria-label="Termômetro de reputação excelente">
              <span className="h-2 rounded-full bg-rep-1" />
              <span className="h-2 rounded-full bg-rep-2" />
              <span className="h-2 rounded-full bg-rep-3" />
              <span className="h-2 rounded-full bg-rep-4" />
              <span className="h-2.5 -translate-y-0.5 rounded-full bg-rep-5" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Excelente atendimento e entregas dentro do prazo.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-14 border-t border-border pt-10">
        <h2 className="text-xl font-bold text-foreground">Quem viu este produto também gostou</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item, idx) => (
            <ProductCard key={item.id} product={item} index={idx} />
          ))}
        </div>
      </section>
    </div>
  );
}