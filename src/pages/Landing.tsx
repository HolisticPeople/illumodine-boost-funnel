import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bottleLarge from "@/assets/illum-2oz-bottle.png";
import bottleSmall from "@/assets/illum-05oz-bottle.png";
import logo from "@/assets/holisticpeople-logo.png";
import heroBanner from "@/assets/hero-banner.png";
import drCousens from "@/assets/dr-cousens.png";
import BlackFridayRibbon from "@/components/BlackFridayRibbon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Landing = () => {
  const navigate = useNavigate();
  
  // Set to false to hide Black Friday ribbons
  const showBlackFridayRibbons = true;

  return (
    <div className="min-h-screen bg-background">
      {/* Logo */}
      <div className="absolute top-6 left-6 z-10">
        <a href="https://holisticpeople.com" target="_blank" rel="noopener noreferrer">
          <img src={logo} alt="HolisticPeople" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
        </a>
      </div>
      
      {/* Black Friday Banner */}
      {showBlackFridayRibbons && (
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-3 text-center sticky top-0 z-30 shadow-lg">
          <p className="text-lg md:text-xl font-bold tracking-wide">
            🔥 BLACK FRIDAY SPECIAL - Limited Time Offer! 🔥
          </p>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center">
        {/* Background with flowing effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-background opacity-90" />
        <div className="absolute inset-0" style={{ 
          background: 'radial-gradient(ellipse at 30% 50%, hsl(280 65% 35% / 0.4), transparent 50%), radial-gradient(ellipse at 70% 50%, hsl(45 95% 50% / 0.3), transparent 50%)',
        }} />
        
        {/* Animated flowing lines effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        
        <div className="relative w-full max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-left space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-accent drop-shadow-[0_0_30px_hsl(45_95%_60%/0.5)]">
                Illumodine™
              </h1>
              <p className="text-3xl md:text-4xl font-semibold text-accent/90">
                The best Iodine in the world!
              </p>
              <p className="text-xl md:text-2xl text-foreground/90">
                Pure, High-Potency Iodine Supplement
              </p>
              <p className="text-lg text-muted-foreground max-w-xl">
                The most bioavailable iodine supplement on Earth – charged with True Scalar Energy™ for maximum effectiveness
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/checkout')}
                className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground font-bold text-xl px-12 py-6 rounded-full shadow-[0_0_30px_hsl(45_95%_60%/0.5)] hover:shadow-[0_0_50px_hsl(45_95%_60%/0.7)] transition-all duration-300 mt-8"
              >
                Get Your Special Offer Now
              </Button>
            </div>

            {/* Right: Large Bottle Image */}
            <div className="relative flex justify-center items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-primary/30 to-accent/20 rounded-full blur-3xl scale-75" />
              <img 
                src={bottleLarge} 
                alt="Illumodine 2oz bottle" 
                className="relative w-full max-w-md h-auto drop-shadow-[0_0_40px_hsl(45_95%_60%/0.6)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dr. Cousens Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary/30 via-background to-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-accent">
            Meet Dr. Gabriel Cousens
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12">
            The Creator of Illumodine™
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            {/* Left: Dr. Cousens Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/30 rounded-full blur-2xl scale-90" />
                <img 
                  src={drCousens} 
                  alt="Dr. Gabriel Cousens" 
                  className="relative rounded-2xl shadow-2xl w-full max-w-md"
                />
              </div>
            </div>

            {/* Right: Quotes */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-accent">On Detoxification & Purity</h3>
                <div className="space-y-3">
                  <blockquote className="text-foreground/90 italic border-l-4 border-accent pl-4">
                    "Forces out fluoride from the pineal gland... uncalcifies the pineal gland."
                  </blockquote>
                  <blockquote className="text-foreground/90 italic border-l-4 border-accent pl-4">
                    "Forces out bromine, chloride, lead, mercury, and cadmium."
                  </blockquote>
                  <blockquote className="text-foreground/90 italic border-l-4 border-accent pl-4">
                    "Clear[s] the pineal gland... opening it up."
                  </blockquote>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-accent">On Superior Absorption</h3>
                <div className="space-y-3">
                  <blockquote className="text-foreground/90 italic border-l-4 border-accent pl-4">
                    "Far more active... better absorbed, better utilized."
                  </blockquote>
                  <blockquote className="text-foreground/90 italic border-l-4 border-accent pl-4">
                    "Illumodine is in the I-minus form... activated in that way."
                  </blockquote>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-accent">On General Wellness</h3>
                <div className="space-y-3">
                  <blockquote className="text-foreground/90 italic border-l-4 border-accent pl-4">
                    "The general mineral for optimal health."
                  </blockquote>
                  <blockquote className="text-foreground/90 italic border-l-4 border-accent pl-4">
                    "The most important mineral besides oxygen for overall function."
                  </blockquote>
                  <blockquote className="text-foreground/90 italic border-l-4 border-accent pl-4">
                    "A big player in adrenals, lungs, breast, skin [and] estrogen regulation."
                  </blockquote>
                  <blockquote className="text-foreground/90 italic border-l-4 border-accent pl-4">
                    "The universal health mineral."
                  </blockquote>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-accent">On Spiritual Connection</h3>
                <div className="space-y-3">
                  <blockquote className="text-foreground/90 italic border-l-4 border-accent pl-4">
                    "Connected with the opening up of the fifth chakra."
                  </blockquote>
                  <blockquote className="text-foreground/90 italic border-l-4 border-accent pl-4">
                    "Helps open up... the upper chakras."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Article */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full md:w-auto mx-auto flex items-center gap-2 text-lg border-accent/50 hover:border-accent hover:bg-accent/10"
              >
                Read Full Article About Iodine
                <ChevronDown className="w-5 h-5" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-8">
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-accent/30">
                <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
                  <p>
                    Iodine is an essential element. Although its main function is in the production of thyroid hormones by the thyroid gland, other organs in the body have a need for iodine in order to function normally. Iodine builds jing and chi.
                  </p>
                  <p>
                    Several studies have demonstrated the relationship not only between iodine and the thyroid gland, but also between low iodine and fibrocystic disease of the breast (FDB), and breast cancer. Studies showed Japanese women living in Japan consumed a daily average of 13.8 mg of elemental iodine and then experienced one of the lowest risk for breast, ovarian, and uterine cancer (1 in 20).
                  </p>
                  <p>
                    Iodine is the metabolic mineral. Iodine is very important for the thyroid and a variety of different glands and brain function. It prevents goiter and helps with cell metabolism. Iodine is very important in the body for the assimilation of the key minerals calcium, silica, chlorine, and fluorine. Iodine is important for brain function and teeth and bone metabolism. It is found also in high concentrations in the spleen, blood, saliva, perspiration, and tears. An excess of iodine will show up with the symptoms of nervousness and anxiousness, bulging eyeballs, and acute sense of touch. Psychological symptoms are fear of the future, oversensitivity, and nervous tremor. Signs of iodine deficiency can also include nervousness, but with increased cholesterol, weight gain, restlessness, slow mind, slow metabolism, fearfulness, goiter, awkwardness, much mucus, and heart and lung difficulties.
                  </p>
                  <p>
                    Iodine seems to work as a monitor, or controller, for calcium metabolism. It's one of the key minerals. Iodine has the highest frequency of all of Nature's essential minerals. It supports enzyme systems that help the functioning of certain thyroid hormones and assists in regulating cellular metabolic rates. It may be helpful in protecting against breast cancer. It is important for normal mental and physical development in children because of the importance of normal thyroid in a child's growth and development. Lack of iodine may also be associated with retarded growth in children, poor bone development, bad teeth, and dull mental functioning.
                  </p>
                  <p>
                    As far back as 1915, as many as 90 percent of the American population were considered deficient in iodine. Iodine appears to be one of the minerals that get burned up by stress, and so whenever there's anxiety, tension, and depression, there may be a need for iodine. Iodine acts in the body as a cleanser. It protects the brain by destroying toxins in the blood before it passes the blood brain barrier and increases the assimilation of salts for normal metabolism. Iodine, because it is water-soluble, works with the lymph, travels to every cell in the body, works as a disinfectant, balances the metabolism, and creates electrical balance in the body. It is best to think about the minerals in synergistic patterns. Iodine is a very good example of that because these key elements work in patterns to make the organs and tissue work in an optimal way. The pattern is just a little bit different for each person. An example of this is cataracts, which seem to be connected to calcium being pulled out of the pattern because of a lack of iodine. Iodine also works in relationship with phosphorous to activate the brain's clarity. Dulse may be a better choice for supplying iodine than kelp because dulse has a little bit more manganese than kelp, and manganese is an important element for the functioning of iodine in the system.
                  </p>
                  <p>
                    The foods richest in iodine are dulse and kelp. All sea vegetables basically contain all of the minerals of the sea, bringing us a good source of trace minerals in general. Besides kelp and dulse, the foods that are high in iodine are asparagus, blueberries, Brussels sprouts, cardamom, carrots, chervil, chives, coconuts, cucumbers, eggplant, garlic, green peppers, kale, leaf lettuce, loganberries, mustard greens, okra, oats, onions, potatoes, rutabaga, all the sea vegetables, spinach, squash, strawberries, Swiss chard, tomatoes, and watermelon.
                  </p>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-secondary/20 to-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-accent">
            Why Illumodine™?
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Experience the power of 100% bioactive iodine (I⁻) – the most ancient and powerful antioxidant on Earth
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(45_95%_60%/0.2)]">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p className="text-foreground">{benefit}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 md:p-12 bg-gradient-to-br from-secondary/50 to-card/50 backdrop-blur-sm border-accent/30">
            <h3 className="text-3xl font-bold mb-6 text-accent">What Makes Illumodine™ Superior?</h3>
            <div className="space-y-4 text-foreground/90">
              <p>
                <strong className="text-accent">100% Bioactive Iodine (I⁻):</strong> Illumodine™ contains singlet iodine atoms in their most bioavailable form, ensuring maximum absorption and effectiveness.
              </p>
              <p>
                <strong className="text-accent">True Scalar Energy™ Charged:</strong> Through a proprietary process using beyond-quantum science, Illumodine™ is charged with the highest frequency available to humanity, dramatically enhancing its bioavailability and effectiveness.
              </p>
              <p>
                <strong className="text-accent">Extreme Purity:</strong> Made with scalar-charged 200 proof, non-GMO grain alcohol and singlet iodine atoms – nothing else. No additives, no fillers, just pure potency.
              </p>
              <p>
                <strong className="text-accent">Developed by Dr. Gabriel Cousens:</strong> With decades of research and hundreds of patients studied since 2011, Dr. Cousens has perfected this formulation for optimal brain function and whole-body health.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Science Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-accent">
            The Science Behind Illumodine™
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-2xl font-bold mb-4 text-accent">Brain Function & Mental Clarity</h3>
              <p className="text-foreground/90 mb-4">
                Iodine sufficiency activates mitochondria to produce 18 times more brain cell energy. A healthy brain cell contains up to 5,000 mitochondria, while iodine-deficient cells have only 200-300.
              </p>
              <ul className="space-y-2 text-foreground/90">
                <li>• Up to 13.5 points higher IQ in children of iodine-sufficient mothers</li>
                <li>• Up to 9 points higher IQ in iodine-sufficient preschool children</li>
                <li>• Amelioration of depression and anxiety</li>
                <li>• Enhanced clarity of mind and consciousness</li>
              </ul>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-2xl font-bold mb-4 text-accent">Cellular Protection & Detoxification</h3>
              <p className="text-foreground/90 mb-4">
                Active Iodine (I⁻) absorbs 3,000 times more ionizing radiation than normal tissue, protecting DNA from radiation damage at the cellular membrane level.
              </p>
              <ul className="space-y-2 text-foreground/90">
                <li>• Powerful antioxidant and radioprotection</li>
                <li>• Eliminates fluoride from the pineal gland</li>
                <li>• Helps remove mercury, lead, aluminum, and cadmium</li>
                <li>• Supports DNA repair and healthy apoptosis</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/20 via-secondary/30 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-accent">
            Limited Time Special Offer
          </h2>
          <p className="text-xl text-foreground/90 mb-8">
            Experience the transformative power of Illumodine™ with our exclusive offers
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 bg-card/70 backdrop-blur-sm border-accent/50 shadow-[0_0_30px_hsl(45_95%_60%/0.2)] relative overflow-visible h-full flex flex-col">
              <BlackFridayRibbon enabled={showBlackFridayRibbons} position="top-left" />
              <div className="text-accent text-6xl font-bold mb-4">$29</div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Starter Size</h3>
              
              {/* Bottle Image */}
              <div className="flex justify-center mb-4">
                <img 
                  src={bottleSmall} 
                  alt="Illumodine 0.5oz bottle" 
                  className="h-24 w-auto drop-shadow-lg"
                />
              </div>
              
              <p className="text-lg mb-4 text-accent">0.5 fl oz (15ml) Bottle</p>
              <p className="text-foreground/80 mb-6">+ FREE Shipping (US Only)</p>
              <ul className="text-left space-y-2 mb-6 text-foreground/90 flex-grow">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-accent" />
                  Perfect for trying Illumodine™
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-accent" />
                  Pure, high-potency formula
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-accent" />
                  Scalar energy charged
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-accent/10 to-card/70 backdrop-blur-sm border-accent shadow-[0_0_40px_hsl(45_95%_60%/0.3)] relative overflow-visible h-full flex flex-col">
              <BlackFridayRibbon enabled={showBlackFridayRibbons} position="top-left" />
              <div className="absolute -top-4 right-4 bg-accent text-accent-foreground px-4 py-1 rounded-full font-bold text-sm z-20">
                BEST VALUE
              </div>
              <div className="text-accent text-6xl font-bold mb-4">$114</div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Value Pack</h3>
              
              {/* Show both bottles */}
              <div className="flex justify-center items-end gap-4 mb-4">
                <img 
                  src={bottleLarge} 
                  alt="Illumodine 2oz bottle" 
                  className="h-32 w-auto drop-shadow-lg"
                />
                <div className="text-3xl font-bold text-accent flex items-center pb-4">+</div>
                <img 
                  src={bottleSmall} 
                  alt="Free Illumodine 0.5oz bottle" 
                  className="h-20 w-auto drop-shadow-lg"
                />
              </div>
              
              <p className="text-lg mb-2 text-accent font-semibold">2 fl oz (60ml) Bottle</p>
              <p className="text-foreground/80 mb-4">+ FREE 0.5oz Bottle + FREE Shipping (US Only)</p>
              <p className="text-sm text-accent/80 mb-6 font-semibold">(2.5 fl oz total)</p>
              <ul className="text-left space-y-2 mb-6 text-foreground/90 flex-grow">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-accent" />
                  Maximum savings per dose
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-accent" />
                  Get a FREE 0.5oz bottle
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-accent" />
                  Longer-lasting supply
                </li>
              </ul>
            </Card>
          </div>

          <Button 
            size="lg" 
            onClick={() => navigate('/checkout')}
            className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground font-bold text-xl px-12 py-6 rounded-full shadow-[0_0_30px_hsl(45_95%_60%/0.5)] hover:shadow-[0_0_50px_hsl(45_95%_60%/0.7)] transition-all duration-300"
          >
            Claim Your Special Offer Now
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-accent">
            What Our Customers Say
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Real results from real people
          </p>
          
          <Card className="p-8 bg-gradient-to-br from-card/80 to-secondary/30 backdrop-blur-sm border-accent/30">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-accent">Excellent!</h3>
            <p className="text-lg text-foreground/90 mb-6 italic">
              "I was pretty sure I was struggling with some thyroid issues prior to trying this but was also interested in the detoxifying effects Dr Cousens spoke about regarding this supplement. Within just over a week, my chronic fatigue and pain diminished by around 40%. I haven't felt this clear, comfortable, and energetic in years. Very thrilled so far. Thank you!"
            </p>
            <p className="text-foreground font-semibold">— Dorothy</p>
          </Card>
        </div>
      </section>

      {/* Hero Banner Section - Moved to end */}
      <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-primary/30 via-secondary/40 to-background">
        <div className="max-w-7xl mx-auto">
          <img 
            src={heroBanner} 
            alt="Illumodine - The best Iodine in the world!" 
            className="w-full h-auto object-cover rounded-lg shadow-2xl"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
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

const benefits = [
  "Powerful antioxidant – 3,000x more effective than normal tissue at absorbing radiation",
  "Anti-bacterial, anti-viral, anti-fungal, and anti-parasitic properties",
  "Supports brain function and mental clarity",
  "Enhances mood and reduces anxiety and depression",
  "Supports thyroid health and hormone balance",
  "Promotes detoxification of heavy metals (fluoride, mercury, lead, aluminum)",
  "Provides cellular and DNA protection",
  "Supports energy production at the mitochondrial level",
  "Anti-inflammatory and anti-allergenic benefits",
  "Helps eliminate mutated cells through healthy apoptosis",
  "Supports serotonin production for well-being",
  "Activates and protects the pineal gland",
];

export default Landing;
