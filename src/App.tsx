import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PricesProvider } from "./context/PricesContext";
import Landing from "./pages/Landing";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Root route that can render either Landing or ThankYou based on query params.
const RootPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hasOrder =
    params.get("order_id") ||
    params.get("payment_intent") ||
    params.get("pi_id");

  if (hasOrder) {
    return <ThankYou />;
  }

  return <Landing />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PricesProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<RootPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<ThankYou />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PricesProvider>
  </QueryClientProvider>
);

export default App;
