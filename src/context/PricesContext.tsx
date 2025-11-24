import { createContext, useContext, useEffect, useState } from "react";
import { bridge } from "@/api/bridge";
import { ILLUMODINE_PRODUCTS } from "@/data/products";

interface PricesContextType {
  prices: Record<string, number>;
  loading: boolean;
  getPrice: (sku: string) => number;
}

const PricesContext = createContext<PricesContextType>({
  prices: {},
  loading: true,
  getPrice: () => 0,
});

export const PricesProvider = ({ children }: { children: React.ReactNode }) => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const skus = ILLUMODINE_PRODUCTS.map(p => p.sku).filter(Boolean);
        if (skus.length === 0) return;
        
        const fetched = await bridge.getPricesForSkus(skus);
        setPrices(fetched);
      } catch (err) {
        console.error("Failed to fetch prices", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const getPrice = (sku: string) => {
    // Return fetched price, or fallback to defined default
    if (prices[sku] !== undefined) return prices[sku];
    const prod = ILLUMODINE_PRODUCTS.find(p => p.sku === sku);
    return prod ? prod.defaultPrice : 0;
  };

  return (
    <PricesContext.Provider value={{ prices, loading, getPrice }}>
      {children}
    </PricesContext.Provider>
  );
};

export const usePrices = () => useContext(PricesContext);

