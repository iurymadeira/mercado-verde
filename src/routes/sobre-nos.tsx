import { useEffect, useRef, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  HeartHandshake,
  Leaf,
  Mail,
  Recycle,
  Sparkles,
  Sprout,
  Store,
  Target,
  Truck,
} from "lucide-react";
import heroImg from "@/assets/hero-marketplace.jpg";

export const Route = createFileRoute("/sobre-nos")({
  head: () => ({
    meta: [
      { title: "Sobre nós | Verde Market" },
      {
        name: "description",
        content:
          "Conheça a história, a missão e os compromissos do Verde Market: um marketplace minimalista criado para comprar com simplicidade e menor impacto.",
      },
      { property: "og:title", content: "Sobre nós | Verde Market" },
      {
        property: "og:description",
        content:
          "Conheça a história, a missão e os compromissos do Verde Market: um marketplace minimalista criado para comprar com simplicidade e menor impacto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

/* ------------------------------------------------------------------ */
/* Scroll reveal + animated counters                                   */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function CountUp({
  to,
  decimals = 0,
  suffix = "",
  duration = 1500,
  grouping = true,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  grouping?: boolean;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(to * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouping,
      })}
      {suffix}
    </span>
  );
}

function ProgressBar({ label, percent, delay = 0 }: { label: string; percent: number; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-bold text-primary">
          <CountUp to={percent} suffix="%" duration={1200} />
        </span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-1000 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: inView ? `${percent}%` : "0%", transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card transition-colors duration-200 hover:border-primary/35">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-foreground sm:text-base">{question}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-primary transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: 2019, decimals: 0, suffix: "", label: "Ano de fundação", grouping: false },
  { value: 128, decimals: 0, suffix: " mil", label: "Clientes atendidos", grouping: true },
  { value: 320, decimals: 0, suffix: "", label: "Vendedores parceiros", grouping: true },
  { value: 4.9, decimals: 1, suffix: "", label: "Nota média de satisfação", grouping: true },
];

const PILLARS = [
  {
    icon: BadgeCheck,
    title: "Curadoria real",
    text: "Todo vendedor passa por análise de histórico e reputação antes de entrar na vitrine.",
  },
  {
    icon: Target,
    title: "Preço sem teatro",
    text: "O desconto é calculado sobre o preço de verdade, sem inflação antes da promoção.",
  },
  {
    icon: Truck,
    title: "Entrega que respeita",
    text: "Rotas otimizadas e parceiros com veículos elétricos ou bicicletas em áreas urbanas.",
  },
  {
    icon: HeartHandshake,
    title: "Gente no suporte",
    text: "Atendimento humano em até 4 minutos, todos os dias, das 8h às 20h.",
  },
];

const TIMELINE = [
  {
    year: "2019",
    title: "O primeiro rascunho",
    text: "Tudo começou como um trabalho de faculdade: três estudantes desenharam a tela inicial de um marketplace que não confundisse o cliente.",
  },
  {
    year: "2021",
    title: "Primeiros vendedores",
    text: "Abrimos a plataforma para 40 vendedores de bairro, com cadastro simples, comissão justa e pagamento em até 12x.",
  },
  {
    year: "2023",
    title: "Logística verde",
    text: "Reorganizamos o centro de distribuição, trocamos as embalagens e cortamos a emissão de carbono das entregas urbanas.",
  },
  {
    year: "2025",
    title: "Reconhecimento",
    text: "A experiência de compra foi destaque em uma premiação estudantil de tecnologia e design de produto.",
  },
  {
    year: "2026",
    title: "Onde estamos hoje",
    text: "Mais de 128 mil clientes e 320 vendedores ativos no país — e a mesma tela inicial no coração do projeto.",
  },
];

const COMMITMENTS = [
  { label: "Embalagens recicláveis", percent: 100 },
  { label: "Energia renovável nos centros de distribuição", percent: 87 },
  { label: "Logística reversa de eletrônicos", percent: 64 },
  { label: "Compensação de carbono das entregas", percent: 92 },
];

const TEAM = [
  { name: "Ana Vasconcelos", role: "Direção de Produto", initials: "AV" },
  { name: "Rafael Okada", role: "Liderança de Engenharia", initials: "RO" },
  { name: "Juliana Prado", role: "Experiência de Compra", initials: "JP" },
  { name: "Marcos Teles", role: "Operações e Logística", initials: "MT" },
];

const FAQ = [
  {
    question: "O Verde Market é uma loja de verdade?",
    answer:
      "Não. É um protótipo acadêmico: nenhum pagamento é processado e nenhum pedido é enviado. Busca, carrinho, login e finalização funcionam apenas no seu navegador.",
  },
  {
    question: "Por que o nome Verde Market?",
    answer:
      "O verde resume a proposta: uma compra mais leve, com menos desperdício, preços claros e uma interface que não grita com o cliente.",
  },
  {
    question: "Vendedores podem anunciar aqui?",
    answer:
      "No protótipo o catálogo é fictício, mas o modelo prevê cadastro com análise de reputação, comissão de até 8% e painel de vendas próprio.",
  },
  {
    question: "Como vocês tratam meus dados?",
    answer:
      "Nada é enviado para fora do dispositivo durante a demonstração. Conta, carrinho e histórico de compra ficam salvos apenas no navegador que você está usando.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {text ? <p className="mt-3 text-base text-muted-foreground">{text}</p> : null}
    </Reveal>
  );
}

function AboutPage() {
  return (
    <div>
      {/* Hero institucional */}
      <section className="relative overflow-hidden border-b border-border bg-surface-subtle">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 size-80 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-brand-soft-foreground uppercase">
              <Leaf className="size-3.5 text-primary" />
              Nossa organização
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
              Tecnologia que aproxima pessoas e movimenta o comércio.
            </h1>
            <p className="mt-4 max-w-xl text-base text-foreground/80 sm:text-lg">
              O Verde Market nasceu em uma sala de aula e virou um marketplace completo: simples de
              usar, honesto nos preços e pensado para causar o menor impacto possível.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-95"
              >
                Voltar para a vitrine
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#historia"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-brand-soft/60 active:scale-95"
              >
                Conhecer a história
              </a>
            </div>
          </div>

          <Reveal delay={120} className="relative">
            <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
              <img
                src={heroImg}
                alt="Vitrine minimalista do Verde Market"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm sm:-left-6">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Store className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Marketplace minimalista</p>
                <p className="text-xs text-muted-foreground">Feito no Brasil, para o Brasil</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Números */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90} className="text-center sm:text-left">
              <p className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                <CountUp
                  to={stat.value}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  grouping={stat.grouping}
                />
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground uppercase">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Missão, visão e valores */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Quem somos"
          title="Missão, visão e valores"
          text="Três frases que guiam cada decisão de produto, de preço e de entrega."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Missão",
              text: "Oferecer uma experiência de compra simples, transparente e acessível, conectando pequenos e médios vendedores a quem procura o produto certo.",
            },
            {
              icon: Sparkles,
              title: "Visão",
              text: "Ser referência em marketplace minimalista no Brasil, provando que vender bem e vender de forma sustentável são a mesma coisa.",
            },
            {
              icon: Sprout,
              title: "Valores",
              text: "Transparência, curadoria, sustentabilidade e respeito por quem compra e por quem vende — nessa ordem e ao mesmo tempo.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 110}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-24px_color-mix(in_oklab,var(--primary)_35%,transparent)]">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-primary transition-transform duration-300 group-hover:scale-105">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* História */}
      <section id="historia" className="border-y border-border bg-surface-subtle">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Nossa história"
            title="De trabalho de faculdade a marketplace"
            text="Cada etapa do caminho que saiu de um caderno de estudantes para a tela do seu navegador."
          />

          <ol className="mt-10 space-y-1">
            {TIMELINE.map((step, index) => (
              <Reveal key={step.year} delay={index * 90}>
                <li className="relative flex gap-5 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-card text-xs font-bold text-primary">
                      {step.year}
                    </span>
                    {index < TIMELINE.length - 1 && (
                      <span aria-hidden="true" className="mt-1 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-base font-bold text-foreground sm:text-lg">{step.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Como trabalhamos */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Como trabalhamos"
          title="Quatro princípios que não abrimos mão"
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 90}>
              <div className="h-full rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <pillar.icon className="size-5" />
                </span>
                <h3 className="mt-3.5 text-base font-bold text-foreground">{pillar.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Compromisso verde */}
      <section className="border-y border-border bg-brand-soft/50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Compromisso verde"
              title="Crescer sem aumentar o lixo"
              text="Sustentabilidade aqui não é slogan de campanha: é meta com número, prazo e auditoria interna a cada semestre."
            />
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-card p-4">
              <Recycle className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Até 2028 queremos que 100% das entregas urbanas sejam feitas por veículos de
                emissão zero e que toda embalagem enviada volte para o nosso ciclo de reuso.
              </p>
            </div>
          </div>

          <Reveal delay={120}>
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-7">
              {COMMITMENTS.map((commitment, index) => (
                <ProgressBar
                  key={commitment.label}
                  label={commitment.label}
                  percent={commitment.percent}
                  delay={index * 120}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Equipe */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Quem faz acontecer"
          title="Uma equipe pequena, perto do cliente"
          text="Poucas pessoas, muitas decisões — e todas elas passam por quem usa a loja todos os dias."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((person, index) => (
            <Reveal key={person.name} delay={index * 90}>
              <div className="flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {person.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-surface-subtle">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <SectionHeading eyebrow="Perguntas frequentes" title="O que mais perguntam sobre a gente" />
          <div className="mt-8 space-y-3">
            {FAQ.map((item, index) => (
              <Reveal key={item.question} delay={index * 80}>
                <FaqItem question={item.question} answer={item.answer} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Chamada final */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 text-center sm:px-12">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 -top-24 h-48 bg-primary/10 blur-3xl"
            />
            <div className="relative">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Mail className="size-6" />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Vamos conversar
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                Dúvidas sobre o projeto, sugestões de melhoria ou vontade de ver a vitrine de
                perto: a gente responde todo mundo.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  to="/"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-95"
                >
                  Explorar a vitrine
                  <ArrowRight className="size-4" />
                </Link>
                <span className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground">
                  <Mail className="size-4 text-primary" />
                  contato@verdemarket.com
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
