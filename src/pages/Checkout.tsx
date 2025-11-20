import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Package, ShieldCheck, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bottleLarge from "@/assets/illum-2oz-bottle.png";
import bottleSmall from "@/assets/illum-05oz-bottle.png";

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<"small" | "large">("small");
  const [quantity, setQuantity] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  // Pricing logic
  const smallBottlePrice = 29;
  const largeBottlePrice = 114; // Value Pack price

  const calculateTotal = () => {
    if (selectedOffer === "small") {
      return smallBottlePrice * quantity;
    } else {
      return largeBottlePrice * quantity;
    }
  };

  const calculateFreeBottles = () => {
    if (selectedOffer === "large") {
      return quantity; // 1 free small bottle per large bottle
    }
    return 0;
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData = {
      packageType: selectedOffer,
      quantity,
      totalPrice: calculateTotal(),
      shippingInfo: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }
    };

    navigate('/thank-you', { state: { orderData } });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
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
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 mb-4 ${
                  selectedOffer === "small" 
                    ? "border-accent bg-accent/10 shadow-[0_0_20px_hsl(45_95%_60%/0.3)]" 
                    : "border-border/50 hover:border-accent/50"
                }`}
              >
                <div className="flex items-center gap-6">
                  <img src={bottleSmall} alt="0.5oz bottle" className="w-20 h-auto" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">Starter Size</h3>
                    <p className="text-accent font-semibold">0.5 fl oz (15ml)</p>
                    <p className="text-2xl font-bold text-accent mt-2">${smallBottlePrice}</p>
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
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 relative ${
                  selectedOffer === "large" 
                    ? "border-accent bg-accent/10 shadow-[0_0_20px_hsl(45_95%_60%/0.3)]" 
                    : "border-border/50 hover:border-accent/50"
                }`}
              >
                <div className="absolute -top-3 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                  BEST VALUE
                </div>
                <div className="flex items-center gap-6">
                  <img src={bottleLarge} alt="2oz bottle" className="w-24 h-auto" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">Value Pack</h3>
                    <p className="text-accent font-semibold">2 fl oz (60ml)</p>
                    <p className="text-lg text-accent font-semibold">+ FREE 0.5oz Bottle</p>
                    <p className="text-2xl font-bold text-accent mt-2">${largeBottlePrice}</p>
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
                    You'll receive {calculateFreeBottles()} FREE 0.5oz bottle{calculateFreeBottles() > 1 ? 's' : ''}!
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
                  <span className="font-semibold">${calculateTotal()}</span>
                </div>
                
                {calculateFreeBottles() > 0 && (
                  <div className="flex justify-between text-accent">
                    <span>FREE 0.5oz Bottle × {calculateFreeBottles()}</span>
                    <span className="font-semibold">$0</span>
                  </div>
                )}
                
                <div className="flex justify-between text-foreground">
                  <span>Shipping (US)</span>
                  <span className="font-semibold text-accent">FREE</span>
                </div>
                
                <div className="pt-3 border-t border-accent/30 flex justify-between text-xl font-bold">
                  <span className="text-accent">Total:</span>
                  <span className="text-accent">${calculateTotal()}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                * International shipping rates will be calculated at checkout
              </p>
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
                      className="bg-input border-border/50 text-foreground" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="bg-input border-border/50 text-foreground" 
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
                    className="bg-input border-border/50 text-foreground" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="address" className="text-foreground">Address</Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="bg-input border-border/50 text-foreground" 
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
                      className="bg-input border-border/50 text-foreground" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-foreground">State</Label>
                    <Input 
                      id="state" 
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="bg-input border-border/50 text-foreground" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode" className="text-foreground">ZIP Code</Label>
                    <Input 
                      id="zipCode" 
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="bg-input border-border/50 text-foreground" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-foreground">Country</Label>
                    <Input 
                      id="country" 
                      value={formData.country}
                      onChange={handleInputChange}
                      className="bg-input border-border/50 text-foreground" 
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground font-bold text-lg py-6 rounded-full shadow-[0_0_30px_hsl(45_95%_60%/0.5)] hover:shadow-[0_0_50px_hsl(45_95%_60%/0.7)] transition-all duration-300"
                >
                  Complete Your Order
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
            className="text-accent hover:text-accent/80"
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
