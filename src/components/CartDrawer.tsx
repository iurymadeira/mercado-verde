import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/data/products";
import { useCart } from "@/lib/cart-context";

const FREE_SHIPPING_THRESHOLD = 199;

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    resolvedItems,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalSavings,
    totalItems,
  } = useCart();
  const [orderCompleted, setOrderCompleted] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeCart();
      if (orderCompleted) setOrderCompleted(false);
    }
  };

  const handleCheckout = () => {
    setOrderCompleted(true);
    clearCart();
    toast.success("Pedido simulado concluído com sucesso!");
  };

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col px-6 py-5 sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="size-5 text-primary" />
            Seu carrinho
            {totalItems > 0 && (
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-soft-foreground">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            Simulação de compras do Verde Market. Os itens ficam salvos no seu navegador.
          </SheetDescription>
        </SheetHeader>

        {orderCompleted ? (
          <div className="animate-fade-up flex flex-1 flex-col items-center justify-center px-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-brand-soft text-primary">
              <CheckCircle2 className="size-9" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-foreground">Compra simulada confirmada!</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Este é um protótipo acadêmico de frontend — nenhuma cobrança real foi realizada.
            </p>
            <Button className="mt-6 rounded-full px-6" onClick={() => handleOpenChange(false)}>
              Continuar explorando
            </Button>
          </div>
        ) : resolvedItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-subtle text-muted-foreground">
              <ShoppingBag className="size-7" />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">Seu carrinho está vazio</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Adicione produtos da vitrine para testar o cálculo de parcelas e frete.
            </p>
            <Button variant="outline" className="mt-5 rounded-full" onClick={closeCart}>
              Ver ofertas
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-soft/70 px-3.5 py-2.5 text-xs font-medium text-brand-soft-foreground">
              <Truck className="size-4 shrink-0 text-primary" />
              {remainingForFreeShipping === 0 ? (
                <span>Você ganhou frete grátis neste pedido!</span>
              ) : (
                <span>Faltam {formatBRL(remainingForFreeShipping)} para frete grátis.</span>
              )}
            </div>

            <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
              {resolvedItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/30"
                >
                  <Link
                    to="/produto/$id"
                    params={{ id: product.id }}
                    onClick={closeCart}
                    className="size-18 shrink-0 overflow-hidden rounded-lg bg-surface-subtle"
                  >
                    <img src={product.image} alt={product.title} className="size-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to="/produto/$id"
                        params={{ id: product.id }}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary"
                      >
                        {product.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        aria-label={`Remover ${product.title}`}
                        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-full border border-border bg-surface-subtle">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Diminuir quantidade"
                          className="flex size-7 items-center justify-center rounded-l-full text-foreground transition-colors hover:bg-muted"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="min-w-7 text-center text-xs font-semibold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          aria-label="Aumentar quantidade"
                          className="flex size-7 items-center justify-center rounded-r-full text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        {formatBRL(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3 border-t border-border pt-4">
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-xs text-shipping">
                  <span>Economia total em descontos</span>
                  <span className="font-semibold">-{formatBRL(totalSavings)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">{formatBRL(subtotal)}</p>
                  <p className="text-xs text-muted-foreground">
                    em até 12x de {formatBRL(subtotal / 12)} sem juros
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full rounded-full font-semibold transition-transform active:scale-[0.98]"
                onClick={handleCheckout}
              >
                Finalizar compra (simulação)
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}