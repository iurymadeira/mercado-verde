import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Plus, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { formatBRL, type Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, 1);
    setJustAdded(true);
    toast.success(`${product.title} adicionado ao carrinho`);
    window.setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <article
      style={{ animationDelay: `${index * 55}ms` }}
      className="animate-fade-up product-card group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-surface-subtle"
      >
        <img
          src={product.image}
          alt={product.title}
          className="size-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-bold text-primary backdrop-blur-sm">
          -{product.discountPercent}% OFF
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{product.categoryLabel}</span>
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            <Star className="size-3.5 fill-rating text-rating" />
            {product.rating.toFixed(1)}
            <span className="text-muted-foreground">({product.reviewCount})</span>
          </span>
        </div>

        <Link
          to="/produto/$id"
          params={{ id: product.id }}
          className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base"
        >
          {product.title}
        </Link>

        <div className="mt-3 space-y-0.5">
          <p className="text-xs text-muted-foreground line-through">
            {formatBRL(product.originalPrice)}
          </p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {formatBRL(product.price)}
          </p>
          <p className="text-xs text-shipping">
            em até {product.installments}x de {formatBRL(product.price / product.installments)} sem juros
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-shipping">
          {product.freeShipping && <span>Frete grátis</span>}
          {product.fullDelivery && (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-brand-soft px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-brand-soft-foreground">
              <Zap className="size-3 fill-current" />
              FULL
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          className="mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-soft text-sm font-semibold text-brand-soft-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
        >
          {justAdded ? (
            <>
              <Check className="size-4" />
              Adicionado
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Adicionar ao carrinho
            </>
          )}
        </button>
      </div>
    </article>
  );
}