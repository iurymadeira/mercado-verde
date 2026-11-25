import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Leaf, LogOut, MapPin, Search, ShoppingBag, User, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const { totalItems, openCart, searchQuery, setSearchQuery, cartPulseKey } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (pathname !== "/") {
      void navigate({ to: "/" });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <Link
          to="/"
          onClick={() => setSearchQuery("")}
          className="group flex shrink-0 items-center gap-2 text-foreground transition-opacity hover:opacity-85"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105">
            <Leaf className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            Verde<span className="text-primary">Market</span>
          </span>
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pathname !== "/") void navigate({ to: "/" });
            document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="relative flex-1"
          role="search"
        >
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar produtos, marcas e muito mais..."
            aria-label="Buscar produtos"
            className="h-10 w-full rounded-full border border-input bg-surface-subtle pr-9 pl-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Limpar busca"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </form>

        <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
          <MapPin className="size-3.5 text-primary" />
          <span>Enviar para São Paulo, SP</span>
        </div>

        {user ? (
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="hidden items-center gap-1.5 rounded-full bg-brand-soft/70 px-3 py-1.5 text-xs font-semibold text-brand-soft-foreground sm:inline-flex">
              <User className="size-3.5 text-primary" />
              {user.name.split(" ")[0]}
            </span>
            <button
              type="button"
              onClick={() => {
                logout();
                toast.message("Você saiu da sua conta.");
              }}
              aria-label="Sair da conta"
              className="flex h-10 items-center gap-1 rounded-full border border-border bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <LogOut className="size-3.5" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        ) : (
          <Link
            to="/entrar"
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-brand-soft/60"
          >
            <User className="size-4 text-primary" />
            <span className="hidden sm:inline">Entrar</span>
          </Link>
        )}

        <button
          type="button"
          onClick={openCart}
          aria-label={`Abrir carrinho com ${totalItems} itens`}
          className="relative flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-brand-soft/60 active:scale-95"
        >
          <ShoppingBag className="size-4 text-primary" />
          <span className="hidden sm:inline">Carrinho</span>
          {totalItems > 0 && (
            <span
              key={cartPulseKey}
              className="animate-cart-pop flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground"
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}