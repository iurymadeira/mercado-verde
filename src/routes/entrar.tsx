import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Leaf, Lock, Mail, ShoppingBag, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/data/products";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar ou Criar Conta | Verde Market" },
      {
        name: "description",
        content: "Acesse sua conta ou cadastre-se para finalizar sua compra no Verde Market.",
      },
      { property: "og:title", content: "Entrar ou Criar Conta | Verde Market" },
      {
        property: "og:description",
        content: "Acesse sua conta ou cadastre-se para finalizar sua compra no Verde Market.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { login, register } = useAuth();
  const { pendingCheckout, totalItems, subtotal, setPendingCheckout } = useCart();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isCheckoutFlow = pendingCheckout && totalItems > 0;

  const finishAfterAuth = () => {
    setPendingCheckout(false);
    if (isCheckoutFlow) {
      toast.success(
        mode === "login"
          ? "Login realizado! Prossiga para o pagamento."
          : "Conta criada! Prossiga para o pagamento.",
      );
      void navigate({ to: "/checkout" });
      return;
    }
    toast.success(mode === "login" ? "Login realizado com sucesso!" : "Conta criada com sucesso!");
    void navigate({ to: "/" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        return;
      }
      const res = register(name, email, password);
      if (!res.ok) {
        setError(res.error ?? "Não foi possível criar a conta.");
        return;
      }
      finishAfterAuth();
      return;
    }

    const res = login(email, password);
    if (!res.ok) {
      setError(res.error ?? "Não foi possível entrar.");
      return;
    }
    finishAfterAuth();
  };

  return (
    <div className="mx-auto max-w-md px-4 pt-8 sm:px-6 sm:pt-12">
      <Link
        to="/"
        onClick={() => setPendingCheckout(false)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Voltar para a loja
      </Link>

      {isCheckoutFlow && (
        <div className="animate-fade-up mt-5 flex items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-brand-soft/65 px-4 py-3 text-sm">
          <div className="flex items-center gap-2.5 text-brand-soft-foreground">
            <ShoppingBag className="size-4 shrink-0 text-primary" />
            <span className="font-medium">
              Finalizar pedido ({totalItems} {totalItems === 1 ? "item" : "itens"})
            </span>
          </div>
          <span className="font-bold text-foreground">{formatBRL(subtotal)}</span>
        </div>
      )}

      <div className="animate-fade-up mt-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {isCheckoutFlow ? "Identifique-se para finalizar" : "Acesse sua conta"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Simulação acadêmica — os dados ficam apenas no seu navegador.
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Tipo de acesso"
          className="mt-6 grid grid-cols-2 rounded-full bg-surface-subtle p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`h-9 rounded-full text-sm font-semibold transition-all ${
              mode === "login"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`h-9 rounded-full text-sm font-semibold transition-all ${
              mode === "register"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {mode === "register" && (
            <div className="space-y-1.5">
              <label htmlFor="auth-name" className="text-sm font-medium text-foreground">
                Nome completo
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Mariana Silva"
                  autoComplete="name"
                  className="h-11 w-full rounded-xl border border-input bg-surface-subtle pr-3.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="text-sm font-medium text-foreground">
              E-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                autoComplete="email"
                className="h-11 w-full rounded-xl border border-input bg-surface-subtle pr-3.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="text-sm font-medium text-foreground">
              Senha
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="h-11 w-full rounded-xl border border-input bg-surface-subtle pr-3.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
          </div>

          {mode === "register" && (
            <div className="space-y-1.5">
              <label htmlFor="auth-confirm" className="text-sm font-medium text-foreground">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="auth-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  autoComplete="new-password"
                  className="h-11 w-full rounded-xl border border-input bg-surface-subtle pr-3.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="mt-2 w-full rounded-full font-semibold transition-transform active:scale-[0.98]"
          >
            {mode === "login"
              ? isCheckoutFlow
                ? "Entrar e ir para pagamento"
                : "Entrar"
              : isCheckoutFlow
                ? "Criar conta e ir para pagamento"
                : "Criar conta"}
          </Button>
        </form>

        {mode === "login" && (
          <div className="mt-5 rounded-xl bg-surface-subtle px-3.5 py-2.5 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Conta de demonstração pronta:</p>
            <p className="mt-0.5">
              E-mail: <span className="font-medium text-foreground">aluno@verdemarket.com</span> •
              Senha: <span className="font-medium text-foreground">123456</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}