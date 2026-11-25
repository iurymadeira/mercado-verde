import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProductById, type Product } from "@/data/products";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  totalSavings: number;
  resolvedItems: { product: Product; quantity: number }[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  cartPulseKey: number;
}

const STORAGE_KEY = "verde-market-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartPulseKey, setCartPulseKey] = useState(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (entry): entry is CartItem =>
              typeof entry === "object" &&
              entry !== null &&
              typeof (entry as CartItem).productId === "string" &&
              typeof (entry as CartItem).quantity === "number" &&
              (entry as CartItem).quantity > 0 &&
              getProductById((entry as CartItem).productId) !== undefined,
          );
          setItems(valid);
        }
      }
    } catch {
      // Ignore corrupted localStorage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items, hydrated]);

  const addItem = (productId: string, quantity = 1) => {
    const product = getProductById(productId);
    if (!product || quantity <= 0) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((i) => (i.productId === productId ? { ...i, quantity: nextQty } : i));
      }
      return [...prev, { productId, quantity: Math.min(product.stock, quantity) }];
    });
    setCartPulseKey((k) => k + 1);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const product = getProductById(productId);
    if (!product) return;
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const clamped = Math.min(product.stock, Math.max(1, Math.floor(quantity)));
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: clamped } : i)));
  };

  const clearCart = () => setItems([]);

  const resolvedItems = useMemo(() => {
    return items
      .map((item) => {
        const product = getProductById(item.productId);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter((entry): entry is { product: Product; quantity: number } => entry !== null);
  }, [items]);

  const totalItems = useMemo(
    () => resolvedItems.reduce((acc, item) => acc + item.quantity, 0),
    [resolvedItems],
  );

  const subtotal = useMemo(
    () => resolvedItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [resolvedItems],
  );

  const totalSavings = useMemo(
    () =>
      resolvedItems.reduce(
        (acc, item) => acc + (item.product.originalPrice - item.product.price) * item.quantity,
        0,
      ),
    [resolvedItems],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        totalSavings,
        resolvedItems,
        searchQuery,
        setSearchQuery,
        cartPulseKey,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}