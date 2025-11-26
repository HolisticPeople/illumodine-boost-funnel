import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Package, ShieldCheck, Truck, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bottleLarge from "@/assets/illum-2oz-bottle.png";
import bottleSmall from "@/assets/illum-05oz-bottle.png";
import logo from "@/assets/holisticpeople-logo.png";
import { usePrices } from "@/context/PricesContext";
import { ILLUMODINE_PRODUCTS } from "@/data/products";
import { bridge, ShippingRate, TotalsResponse, CartItem } from "@/api/bridge";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { COUNTRIES, countryNameFor, countryRequiresState } from "@/data/countries";

// Get Products (static lookups)
const smallProduct = ILLUMODINE_PRODUCTS.find(p => p.id === "small");
const largeProduct = ILLUMODINE_PRODUCTS.find(p => p.id === "large");

const Checkout = () => {

  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPrice, loading: pricesLoading } = usePrices();

  const [selectedOffer, setSelectedOffer] = useState<"small" | "large">("small");
  const [quantity, setQuantity] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US" // Default to US code
  });
  const [countryError, setCountryError] = useState<string | null>(null);
  const [countryOpen, setCountryOpen] = useState(false);

  // Checkout state
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | undefined>(undefined);
  const [totals, setTotals] = useState<TotalsResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use ref to track selectedRate without creating circular dependency in fetchTotals
  const selectedRateRef = useRef<ShippingRate | undefined>(undefined);
  useEffect(() => {
    selectedRateRef.current = selectedRate;
  }, [selectedRate]);

  const getCartItems = useCallback((): CartItem[] => {
    const items: CartItem[] = [];
    if (selectedOffer === "small" && smallProduct) {
      // Starter size: paid 0.5oz bottle
      items.push({ sku: smallProduct.sku, qty: quantity });
    } else if (selectedOffer === "large" && largeProduct && smallProduct) {
      // Value pack: paid 2oz bottle + FREE 0.5oz bottle per pack
      items.push({ sku: largeProduct.sku, qty: quantity });
      items.push({
        sku: smallProduct.sku,
        qty: quantity,
        exclude_global_discount: true,
        item_discount_percent: 100,
      });
    }
    return items;
  }, [selectedOffer, quantity]);

  // Calculate Totals
  const fetchTotals = useCallback(async () => {
    const items = getCartItems();
    if (items.length === 0) return;

    setIsCalculating(true);
    try {
      const address = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        city: formData.city,
        state: formData.state,
        postcode: formData.zipCode,
        country: formData.country,
        email: formData.email,
        phone: formData.phone,
      };

      // If we have address for shipping, try to get rates first if not present
      let currentRate = selectedRateRef.current;
      // Free shipping for US
      const countryUpper = formData.country ? formData.country.toUpperCase() : '';
      const isUS = countryUpper === 'US' || countryUpper === 'USA' || countryUpper === 'UNITED STATES';

      if (isUS) {
        // Mock free shipping rate
        const freeRate: ShippingRate = {
          serviceCode: 'free_us',
          serviceName: 'Free US Shipping',
          shipmentCost: 0,
          otherCost: 0
        };
        // Always ensure we use the free rate for US
        if (!currentRate || currentRate.serviceCode !== 'free_us') {
          currentRate = freeRate;
          setSelectedRate(freeRate);
          setShippingRates([freeRate]);
        }
      } else if (formData.zipCode && formData.country && formData.address) {
        // For international, always try to fetch rates if we don't have a valid international rate selected
        // or if the address changed (which triggers this function).
        // We prioritize UPS Worldwide Expedited.
        try {

          const rates = await bridge.calculateShipping(address, items);

          setShippingRates(rates);

          if (rates.length > 0) {
            // Find UPS Worldwide Expedited (handle both camelCase and snake_case)
            const preferredRate = rates.find(r => {
              if (!r) return false; // Skip null/undefined rates
              const name = (r.serviceName || r.service_name || '').toString();
              return name.toLowerCase().includes("ups worldwide expedited");
            });

            if (preferredRate) {
              currentRate = preferredRate;
            } else {
              // Fallback to the first available rate if preferred is not found
              currentRate = rates[0];
            }
            setSelectedRate(currentRate);
          }
        } catch (e: any) {
          console.warn("Shipping fetch failed", e);
          toast({
            title: "Shipping Error",
            description: e.message || "Could not fetch shipping rates.",
            variant: "destructive",
          });
        }
      }

      const res = await bridge.getTotals(address, items, currentRate);
      setTotals(res);
    } catch (error) {
      console.error("Failed to fetch totals", error);
    } finally {
      setIsCalculating(false);
    }
  }, [formData, getCartItems]);

  // Trigger totals update when cart changes
  useEffect(() => {
    fetchTotals();
  }, [selectedOffer, quantity]); // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger totals refresh when address changes (debounced)
  useEffect(() => {
    const needsState = countryRequiresState(formData.country);
    const hasCore =
      !!formData.address &&
      !!formData.city &&
      !!formData.zipCode &&
      formData.country.length >= 2;
    const hasStateOk = !needsState || !!formData.state;
    if (hasCore && hasStateOk) {
      const timer = setTimeout(() => fetchTotals(), 500);
      return () => clearTimeout(timer);
    }
  }, [formData.address, formData.city, formData.state, formData.zipCode, formData.country]); // eslint-disable-line react-hooks/exhaustive-deps


  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    if (e.target.id === "country" && countryError) {
      setCountryError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const needsState = countryRequiresState(formData.country);
    if (needsState && !formData.state.trim()) {
      setIsSubmitting(false);
      toast({
        title: "State required",
        description: "Please fill in the state / province for your country.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.phone.trim()) {
      setIsSubmitting(false);
      toast({
        title: "Phone required",
        description: "Please enter a shipping phone number so carriers can reach you.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const items = getCartItems();
      const address = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        city: formData.city,
        state: formData.state,
        postcode: formData.zipCode,
        country: formData.country,
        email: formData.email,
        phone: formData.phone,
      };

      let submitRate = selectedRate;

      // If no rate selected (e.g. user quick submitted), but it's US, force free shipping
      const countryUpper = formData.country ? formData.country.toUpperCase() : '';
      const isUS = countryUpper === 'US' || countryUpper === 'USA' || countryUpper === 'UNITED STATES';
      if (!submitRate && isUS) {
        submitRate = {
          serviceCode: 'free_us',
          serviceName: 'Free US Shipping',
          shipmentCost: 0,
          otherCost: 0
        };
      }

      const payload = {
        items,
        shipping_address: address,
        customer: {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName
        },
        selected_rate: submitRate ? {
          serviceName: submitRate.serviceName || submitRate.service_name,
          amount: (submitRate.shipmentCost || submitRate.shipping_amount_raw || 0) + (submitRate.otherCost || submitRate.other_cost || 0)
        } : null
      };

      const res = await bridge.submitCheckout(payload);



      // Redirect to hosted payment page
      if (res.client_secret) {
        const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
        const url = new URL(`${window.location.origin}${base}`);
        // Indicate to the SPA that we should show the thank-you experience
        url.searchParams.set("go", "thankyou");
        const returnUrl = url.toString();

        const redirectUrl = bridge.buildHostedConfirmUrl(res.client_secret, returnUrl, res.publishable);

        window.location.href = redirectUrl;
      } else {
        throw new Error("Invalid response from server: missing client_secret");
      }

    } catch (error: any) {
      console.error("Checkout failed", error);
      if (error.code === 'funnel_off' && error.redirect) {
        window.location.href = error.redirect;
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  // Display prices
  const priceSmall = getPrice(smallProduct?.sku || "") || 29;
  const priceLarge = getPrice(largeProduct?.sku || "") || 114;

  const currentPrice = selectedOffer === "small" ? priceSmall : priceLarge;
  const displayTotal = totals ? totals.grand_total : (currentPrice * quantity);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <a href="https://holisticpeople.com" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="HolisticPeople" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent via-accent to-foreground bg-clip-text text-transparent">
            Secure Your Order
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your preferred package and complete your purchase
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Product Selection */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h2 className="text-2xl font-bold mb-6 text-accent">Select Your Package</h2>

              {/* Small Bottle Option */}
              <div
                onClick={() => {
                  setSelectedOffer("small");
                  setQuantity(1);
                }}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 mb-4 ${selectedOffer === "small"
                  ? "border-accent bg-accent/10 shadow-[0_0_20px_hsl(45_95%_60%/0.3)]"
                  : "border-border/50 hover:border-accent/50"
                  }`}
              >
                <div className="flex items-center gap-6">
                  <img src={bottleSmall} alt="0.5oz bottle" className="w-20 h-auto" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">Starter Size</h3>
                    <p className="text-accent font-semibold">0.5 fl oz (15ml)</p>
                    <p className="text-2xl font-bold text-accent mt-2">
                      {pricesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : `$${priceSmall}`}
                    </p>
                    <p className="text-sm text-muted-foreground">+ FREE Shipping (US Only)</p>
                  </div>
                </div>
              </div>

              {/* Large Bottle Option */}
              <div
                onClick={() => {
                  setSelectedOffer("large");
                  setQuantity(1);
                }}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 relative ${selectedOffer === "large"
                  ? "border-accent bg-accent/10 shadow-[0_0_20px_hsl(45_95%_60%/0.3)]"
                  : "border-border/50 hover:border-accent/50"
                  }`}
              >
                <div className="absolute -top-3 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                  BEST VALUE
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
                    <img src={bottleLarge} alt="2oz bottle" className="w-20 h-auto" />
                    <div className="text-2xl font-bold text-accent">+</div>
                    <img src={bottleSmall} alt="Free 0.5oz bottle" className="w-14 h-auto" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-foreground mb-1">Value Pack</h3>
                    <p className="text-accent font-semibold">2 fl oz (60ml)</p>
                    <p className="text-lg text-accent font-semibold">+ FREE 0.5oz Bottle</p>
                    <p className="text-2xl font-bold text-accent mt-2">
                      {pricesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : `$${priceLarge}`}
                    </p>
                    <p className="text-sm text-muted-foreground">+ FREE Shipping (US Only)</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quantity Selector */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-xl font-bold mb-4 text-accent">Quantity</h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  className="border-accent/50 hover:bg-accent/20"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="text-3xl font-bold text-accent w-16 text-center">{quantity}</div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  className="border-accent/50 hover:bg-accent/20"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {selectedOffer === "large" && (
                <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/30">
                  <p className="text-accent font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    You'll receive {quantity} FREE 0.5oz bottle{quantity > 1 ? 's' : ''}!
                  </p>
                </div>
              )}
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-card/30 backdrop-blur-sm border-border/30 text-center">
                <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Secure Checkout</p>
              </Card>
              <Card className="p-4 bg-card/30 backdrop-blur-sm border-border/30 text-center">
                <Truck className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Free US Shipping</p>
              </Card>
              <Card className="p-4 bg-card/30 backdrop-blur-sm border-border/30 text-center">
                <Package className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Quality Guaranteed</p>
              </Card>
            </div>
          </div>

          {/* Right Column - Order Summary & Form */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-6 bg-gradient-to-br from-secondary/50 to-card/50 backdrop-blur-sm border-accent/30">
              <h2 className="text-2xl font-bold mb-6 text-accent">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-foreground">
                  <span>
                    {selectedOffer === "small" ? "0.5oz Bottle" : "2oz Bottle"} × {quantity}
                  </span>
                  <span className="font-semibold">
                    ${(currentPrice * quantity).toFixed(2)}
                  </span>
                </div>

                {selectedOffer === "large" && (
                  <div className="flex justify-between text-accent">
                    <span>FREE 0.5oz Bottle × {quantity}</span>
                    <span className="font-semibold">$0</span>
                  </div>
                )}

                {totals?.discount_total > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-${totals.discount_total.toFixed(2)}</span>
                  </div>
                )}
                {totals?.global_discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Global Discount</span>
                    <span>-${totals.global_discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-foreground">
                  <div className="flex flex-col">
                    <span>Shipping</span>
                    {selectedRate && selectedRate.serviceCode !== 'free_us' && (
                      <span className="text-xs text-muted-foreground">{selectedRate.serviceName || selectedRate.service_name}</span>
                    )}
                  </div>
                  <span className="font-semibold text-accent">
                    {isCalculating ? (
                      <Loader2 className="h-3 w-3 animate-spin inline" />
                    ) : (
                      (formData.country?.toUpperCase() === 'US' ? 'FREE' : (totals?.shipping_total ? `$${totals.shipping_total.toFixed(2)}` : 'Calculated at checkout'))
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-accent/30 flex justify-between text-xl font-bold">
                  <span className="text-accent">Total:</span>
                  <span className="text-accent">
                    {isCalculating ? <Loader2 className="h-4 w-4 animate-spin" /> : `$${displayTotal.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </Card>

            {/* Checkout Form */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-xl font-bold mb-6 text-accent">Shipping Information</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="!bg-input !text-foreground border-border/50 focus-visible:!bg-input focus-visible:!text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="!bg-input !text-foreground border-border/50 focus-visible:!bg-input focus-visible:!text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="!bg-input !text-foreground border-border/50 focus-visible:!bg-input focus-visible:!text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-foreground">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="!bg-input !text-foreground border-border/50 focus-visible:!bg-input focus-visible:!text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-foreground">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="!bg-input !text-foreground border-border/50 focus-visible:!bg-input focus-visible:!text-foreground"
                    />
                  </div>
                  {countryRequiresState(formData.country) && (
                    <div>
                      <Label htmlFor="state" className="text-foreground">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="!bg-input !text-foreground border-border/50 focus-visible:!bg-input focus-visible:!text-foreground"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-foreground">Phone (for shipping updates)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="!bg-input !text-foreground border-border/50 focus-visible:!bg-input focus-visible:!text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode" className="text-foreground">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="!bg-input !text-foreground border-border/50 focus-visible:!bg-input focus-visible:!text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Country</Label>
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded="false"
                          className={cn(
                            "w-full justify-between bg-input border-border/50 text-foreground hover:bg-input/80 hover:!text-foreground",
                            countryError ? "border-red-500" : ""
                          )}
                        >
                          {countryNameFor(formData.country) || "Select country"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[320px]">
                        <Command>
                          <CommandInput placeholder="Search country..." />
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {COUNTRIES.map((c) => (
                              <CommandItem
                                key={c.code}
                                value={`${c.name} ${c.code}`}
                                onSelect={() => {
                                  setFormData((prev) => ({ ...prev, country: c.code }));
                                  if (countryError) setCountryError(null);
                                  setCountryOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.country === c.code ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {c.name} ({c.code})
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {countryError && (
                      <p className="text-xs text-red-500 mt-1">{countryError}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || isCalculating}
                  className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground font-bold text-lg py-6 rounded-full shadow-[0_0_30px_hsl(45_95%_60%/0.5)] hover:shadow-[0_0_50px_hsl(45_95%_60%/0.7)] transition-all duration-300"
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? "Processing..." : "Complete Your Order"}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By completing this purchase, you agree to our terms and conditions.
              </p>
            </Card>
          </div>
        </div>

        {/* Back to Landing */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-accent hover:text-foreground hover:bg-accent/20"
          >
            ← Back to Product Information
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50 mt-12">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p className="mb-2">© 2024 HolisticPeople.com - Manufactured for Dr. Gabriel Cousens</p>
          <p className="text-xs">
            These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure or prevent any disease.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
