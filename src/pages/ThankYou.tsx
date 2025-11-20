import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/holisticpeople-logo.png";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  if (!orderData) {
    navigate("/");
    return null;
  }

  const { packageType, quantity, totalPrice, shippingInfo } = orderData;

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
              Your order has been successfully placed
            </p>
          </div>

          {/* Order Summary Card */}
          <Card className="p-6 mb-6 border-gold shadow-elegant">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b">
                <div>
                  <p className="font-medium text-lg">
                    {packageType === 'small' ? 'Starter Pack' : 'Value Pack'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {packageType === 'small' 
                      ? '0.5oz Bottle + FREE Shipping (US Only)'
                      : '2oz Bottle + FREE 0.5oz Bottle + FREE Shipping (US Only)'
                    }
                  </p>
                </div>
                <p className="font-semibold text-lg">
                  ${packageType === 'small' ? '29.00' : '114.00'}
                </p>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-medium">×{quantity}</p>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <p className="text-muted-foreground">Shipping (US)</p>
                <p className="font-medium text-primary">FREE</p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="text-xl font-bold">Total</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          {/* Shipping Information */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-2 text-muted-foreground">
              <p><span className="font-medium text-foreground">Name:</span> {shippingInfo.fullName}</p>
              <p><span className="font-medium text-foreground">Email:</span> {shippingInfo.email}</p>
              <p><span className="font-medium text-foreground">Address:</span> {shippingInfo.address}</p>
              <p><span className="font-medium text-foreground">City:</span> {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
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
