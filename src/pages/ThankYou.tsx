import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/holisticpeople-logo.png";
import { bridge, OrderSummary } from "@/api/bridge";
import { usePrices } from "@/context/PricesContext";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getPrice } = usePrices();
  
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const searchParams = new URLSearchParams(location.search);
      // Support both payment_intent (Stripe-style) and pi_id (internal)
      const piId = searchParams.get("payment_intent") || searchParams.get("pi_id");
      const orderIdParam = searchParams.get("order_id");
      
      // If we have state from local navigation (e.g. direct transition, though less likely now with hosted page),
      // we could use it, but fetching fresh data is safer.
      
      if (!piId && !orderIdParam) {
          // Fallback to location state if available (e.g. dev testing)
          if (location.state?.orderData) {
             // render legacy/mock view?
             setLoading(false);
             return;
          }
          setError("No order information found.");
          setLoading(false);
          return;
      }

      try {
        // If we have PI ID but no Order ID, we might need to poll or resolve
        let oid = orderIdParam;
        if (!oid && piId) {
            // Try to resolve order ID from PI (polling might be needed if webhook is slow)
            // Simple retry logic
            let retries = 5;
            while (retries > 0 && !oid) {
                try {
                    oid = await bridge.resolveOrderByPi(piId);
                } catch (e) {
                    // ignore 404
                }
                if (!oid) {
                    await new Promise(r => setTimeout(r, 2000));
                    retries--;
                }
            }
        }

        if (oid) {
            const summary = await bridge.getOrderSummary(oid, piId || undefined);
            setOrder(summary);
        } else {
             // If we still can't find the order, maybe show "Processing" state
             setError("Order is processing. Please check your email for confirmation.");
        }
      } catch (err: any) {
        console.error("Order fetch failed", err);
        setError(err.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="p-8 max-w-md text-center border-destructive/50">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate('/')}>Return Home</Button>
        </Card>
      </div>
    );
  }
  
  // Fallback for legacy state (if simple checkout flow without backend)
  // This handles the case where `location.state.orderData` exists but no backend order
  // We'll skip this if we want to enforce backend Orders. 
  // Given "Tailor to... setting", we assume Backend Order is primary.
  
  if (!order) {
      // Should be handled by error state, but just in case
       return (
         <div className="min-h-screen flex items-center justify-center">
            <p>Order not found.</p>
         </div>
       );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Logo */}
      <div className="container mx-auto px-4 pt-6">
        <a href="https://holisticpeople.com" target="_blank" rel="noopener noreferrer">
          <img src={logo} alt="HolisticPeople" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
        </a>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Thank You For Your Order!
            </h1>
            <p className="text-muted-foreground text-lg">
              Order #{order.order_number} has been successfully placed
            </p>
          </div>

          {/* Order Summary Card */}
          <Card className="p-6 mb-6 border-gold shadow-elegant">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {order.items.map((item, i) => {
                // For free 0.5oz bottles, show actual price instead of $0
                const displayPrice = item.total === 0 && item.sku === "HG-Illum05" 
                  ? getPrice("HG-Illum05") * item.qty
                  : item.total;
                
                return (
                  <div key={i} className="flex justify-between items-start pb-4 border-b last:border-0">
                    <div className="flex items-start gap-3">
                         {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />}
                         <div>
                            <p className="font-medium text-lg">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                         </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-lg">${displayPrice.toFixed(2)}</p>
                        {item.subtotal > item.total && item.total !== 0 && (
                            <p className="text-xs text-green-600 line-through">${item.subtotal.toFixed(2)}</p>
                        )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-medium">${order.items.reduce((sum, item) => {
                      const displayPrice = item.total === 0 && item.sku === "HG-Illum05" 
                        ? getPrice("HG-Illum05") * item.qty
                        : item.total;
                      return sum + displayPrice;
                    }, 0).toFixed(2)}</p>
                </div>
                {order.items_discount > 0 && (
                     <div className="flex justify-between items-center text-green-600">
                        <p>Savings</p>
                        <p>-${order.items_discount.toFixed(2)}</p>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Shipping</p>
                    <p className="font-medium">{order.shipping_total > 0 ? `$${order.shipping_total.toFixed(2)}` : 'FREE'}</p>
                </div>
                {order.fees_total !== 0 && (
                     <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Fees/Adjustments</p>
                        <p className="font-medium">${order.fees_total.toFixed(2)}</p>
                    </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                    <p className="text-xl font-bold">Total</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ${order.grand_total.toFixed(2)}
                    </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Shipping & Tracking Note */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h3 className="font-semibold mb-2 text-lg">📦 Shipping & Tracking</h3>
            <p className="text-muted-foreground mb-4">
              Your order will be processed within 1-2 business days. You will receive a tracking number via email once your order ships. 
              Please allow 3-7 business days for delivery within the US.
            </p>
            <p className="text-sm text-muted-foreground">
              If you have any questions about your order, please contact us at{" "}
              <a href="mailto:contact@holisticpeople.com" className="text-primary hover:underline">
                contact@holisticpeople.com
              </a>
            </p>
          </Card>

          {/* Return to HP Button */}
          <div className="text-center">
            <Button
              onClick={() => window.location.href = 'https://holisticpeople.com'}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-glow"
            >
              Return to HolisticPeople.com
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
