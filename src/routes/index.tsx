import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, CreditCard, RotateCcw, ShieldCheck, SlidersHorizontal, Truck } from "lucide-react";
import heroImg from "@/assets/hero-marketplace.jpg";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart-context";

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating" | "discount";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verde Market — Ofertas e Vitrine Minimalista" },
      {
        name: "description",
        content: "Explore eletrônicos, casa, moda e acessórios com frete grátis e parcelamento sem juros no Verde Market.",
      },
      { property: "og:title", content: "Verde Market — Ofertas e Vitrine Minimalista" },
      {
        property: "og:description",
        content: "Explore eletrônicos, casa, moda e acessórios com frete grátis e parcelamento sem juros no Verde Market.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { searchQuery, setSearchQuery } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("todos");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matches = PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === "todos" || product.category === selectedCategory;
      const matchesQuery =
        query.length === 0 ||
        product.title.toLowerCase().includes(query) ||
        product.categoryLabel.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    const sorted = [...matches];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "discount") sorted.sort((a, b) => b.discountPercent - a.discountPercent);
    return sorted;
  }, [searchQuery, selectedCategory, sortBy]);

  const hasActiveFilters = selectedCategory !== "todos" || searchQuery.trim().length > 0;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-surface-subtle">
        <img
          src={heroImg}
          alt="Vitrine minimalista Verde Market"
          className="absolute inset-0 size-full object-cover object-right opacity-95"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-surface-subtle/92 via-surface-subtle/75 to-surface-subtle/20 sm:from-surface-subtle/45 sm:via-surface-subtle/15 sm:to-transparent"
        />
        <div className="relative mx-auto flex min-h-[380px] max-w-6xl items-center px-4 py-14 sm:min-h-[440px] sm:px-6">
          <div className="animate-fade-up max-w-xl">
            <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
              Semana Verde • Até 23% OFF
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl sm:leading-[1.05]">
              Compras leves, entrega rápida.
            </h1>
            <p className="mt-4 max-w-md text-base text-foreground/80 sm:text-lg">
              Eletrônicos, casa e acessórios selecionados com parcelamento sem juros e frete grátis.
            </p>
            <a
              href="#catalogo"
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-95"
            >
              Explorar ofertas
              <ArrowDown className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-4 text-sm sm:grid-cols-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Truck className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Frete grátis</p>
              <p className="text-xs text-muted-foreground">Em pedidos acima de R$ 199</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Até 12x sem juros</p>
              <p className="text-xs text-muted-foreground">Cartão de crédito ou Pix</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Compra garantida</p>
              <p className="text-xs text-muted-foreground">Devolução grátis em até 30 dias</p>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filtrar por categoria">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`h-9 rounded-full px-4 text-sm font-medium transition-all duration-200 active:scale-95 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border border-border bg-card text-foreground hover:border-primary/40 hover:bg-brand-soft/60"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <label htmlFor="sort-select" className="sr-only">
              Ordenar produtos
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 rounded-full border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors focus:border-primary focus:outline-none"
            >
              <option value="relevance">Mais relevantes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="rating">Melhor avaliados</option>
              <option value="discount">Maior desconto</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
            {searchQuery.trim() ? ` para "${searchQuery.trim()}"` : ""}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("todos");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <RotateCcw className="size-3.5" />
              Limpar filtros
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-card px-6 py-14 text-center">
            <p className="text-base font-semibold text-foreground">
              Nenhum produto encontrado para essa busca.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tente outro termo ou explore todas as categorias da vitrine.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("todos");
                setSearchQuery("");
              }}
              className="mt-5 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Ver todos os produtos
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
