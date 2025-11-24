import bottleSmall from "@/assets/illum-05oz-bottle.png";
import bottleLarge from "@/assets/illum-2oz-bottle.png";

export interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  // Fallback price if API fails (MSRP)
  defaultPrice: number; 
}

export const ILLUMODINE_PRODUCTS: Product[] = [
  {
    id: "small",
    name: "Illumodine™ (0.5 fl oz) - Starter Size",
    sku: "HG-Illum05",
    image: bottleSmall,
    defaultPrice: 29.00
  },
  {
    id: "large",
    name: "Illumodine™ (2 fl oz) - Value Pack",
    sku: "HG-Illum2",
    image: bottleLarge,
    defaultPrice: 114.00
  }
];
