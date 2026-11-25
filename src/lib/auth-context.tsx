import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface AuthUser {
  name: string;
  email: string;
}

interface StoredAccount extends AuthUser {
  password: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  hydrated: boolean;
  login: (email: string, password: string) => AuthResult;
  register: (name: string, email: string, password: string) => AuthResult;
  logout: () => void;
}

const SESSION_KEY = "verde-market-session-v1";
const ACCOUNTS_KEY = "verde-market-accounts-v1";

const DEMO_ACCOUNT: StoredAccount = {
  name: "Visitante Demo",
  email: "aluno@verdemarket.com",
  password: "123456",
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function readAccounts(): StoredAccount[] {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [DEMO_ACCOUNT];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [DEMO_ACCOUNT];
    const valid = parsed.filter(
      (a): a is StoredAccount =>
        typeof a === "object" &&
        a !== null &&
        typeof (a as StoredAccount).name === "string" &&
        typeof (a as StoredAccount).email === "string" &&
        typeof (a as StoredAccount).password === "string",
    );
    const hasDemo = valid.some((a) => a.email === DEMO_ACCOUNT.email);
    return hasDemo ? valid : [DEMO_ACCOUNT, ...valid];
  } catch {
    return [DEMO_ACCOUNT];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          typeof (parsed as AuthUser).name === "string" &&
          typeof (parsed as AuthUser).email === "string"
        ) {
          setUser({
            name: (parsed as AuthUser).name,
            email: (parsed as AuthUser).email,
          });
        }
      }
    } catch {
      // Ignore corrupted session
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (user) {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [user, hydrated]);

  const login = (rawEmail: string, password: string): AuthResult => {
    const email = rawEmail.trim().toLowerCase();
    if (!email || !password) {
      return { ok: false, error: "Preencha seu e-mail e senha." };
    }
    if (!isValidEmail(email)) {
      return { ok: false, error: "Digite um e-mail válido." };
    }
    const accounts = readAccounts();
    const found = accounts.find((a) => a.email === email && a.password === password);
    if (!found) {
      return { ok: false, error: "E-mail ou senha incorretos." };
    }
    setUser({ name: found.name, email: found.email });
    return { ok: true };
  };

  const register = (rawName: string, rawEmail: string, password: string): AuthResult => {
    const name = rawName.trim();
    const email = rawEmail.trim().toLowerCase();
    if (name.length < 2) {
      return { ok: false, error: "Informe seu nome completo." };
    }
    if (!isValidEmail(email)) {
      return { ok: false, error: "Digite um e-mail válido." };
    }
    if (password.length < 6) {
      return { ok: false, error: "A senha deve ter pelo menos 6 caracteres." };
    }
    const accounts = readAccounts();
    if (accounts.some((a) => a.email === email)) {
      return { ok: false, error: "Já existe uma conta cadastrada com este e-mail." };
    }
    const nextAccount: StoredAccount = { name, email, password };
    try {
      window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, nextAccount]));
    } catch {
      // Ignore storage errors
    }
    setUser({ name, email });
    return { ok: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, hydrated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}