import { APP_API_BASE, APP_ORIGIN, FUNNEL_ID } from "../config";

const headers = {
  "Content-Type": "application/json"
};

export interface CartItem {
  product_id?: number; // optional if resolving by SKU
  sku: string;
  qty: number;
}

export interface Address {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  email?: string; // usually passed in customer obj, but good to have
}

export interface ShippingRate {
  serviceCode: string;
  serviceName: string;
  shipmentCost: number;
  otherCost: number;
}

export interface TotalsResponse {
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  fees_total: number;
  global_discount: number;
  points_discount: number;
  discounted_subtotal: number;
  grand_total: number;
}

export interface OrderSummary {
  order_id: number;
  order_number: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    subtotal: number;
    total: number;
    image: string;
    sku: string;
  }>;
  shipping_total: number;
  fees_total: number;
  points_redeemed: { points: number; value: number };
  grand_total: number;
  items_discount: number;
}

export const bridge = {
  async calculateShipping(address: Address, items: CartItem[]) {
    const res = await fetch(`${APP_API_BASE}/shipstation/rates`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        funnel_id: FUNNEL_ID,
        shipping_address: address,
        items
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Shipping rate error");
    return json as ShippingRate[];
  },

  async getTotals(
    address: Address, 
    items: CartItem[], 
    selectedRate?: ShippingRate,
    pointsToRedeem: number = 0
  ) {
    const res = await fetch(`${APP_API_BASE}/totals`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        funnel_id: FUNNEL_ID,
        address,
        items,
        selected_rate: selectedRate ? {
          serviceName: selectedRate.serviceName,
          amount: selectedRate.shipmentCost + selectedRate.otherCost
        } : null,
        points_to_redeem: pointsToRedeem
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Totals error");
    return json as TotalsResponse;
  },

  async submitCheckout(payload: any) {
    const res = await fetch(`${APP_API_BASE}/checkout/intent`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        funnel_id: FUNNEL_ID,
        funnel_name: "Illumodine Boost",
        ...payload
      })
    });
    const json = await res.json();
    if (!res.ok) {
        // If 409 funnel_off, throw specific object so UI can redirect
        if (res.status === 409 && json.code === 'funnel_off') {
            throw { code: 'funnel_off', redirect: json.data?.redirect || '/' };
        }
        throw new Error(json.message || "Checkout error");
    }
    return json;
  },

  async getPricesForSkus(skus: string[]) {
    const res = await fetch(`${APP_API_BASE}/catalog/prices?skus=${skus.join(',')}&funnel_id=${FUNNEL_ID}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Price fetch error");
    return json as Record<string, number>; // sku -> price
  },
  
  async getOrderSummary(orderId?: string, piId?: string) {
    const url = new URL(`${APP_API_BASE}/orders/summary`);
    if (orderId) url.searchParams.set('order_id', orderId);
    if (piId) url.searchParams.set('pi_id', piId);
    
    const res = await fetch(url.toString());
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Order summary error");
    return json as OrderSummary;
  },

  async resolveOrderByPi(piId: string) {
      const res = await fetch(`${APP_API_BASE}/orders/resolve?pi_id=${piId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Resolve error");
      return json.order_id;
  },

  buildHostedConfirmUrl(clientSecret: string, returnUrl: string, publishableKey?: string) {
    // Use the WordPress hosted page to avoid inline JS issues and provide a clean environment
    // We pass the client_secret and the final success URL (this SPA's thank-you page)
    // The hosted page will handle the Stripe.js loading and confirmation
    const wpBase = APP_API_BASE.replace('/wp-json/hp-funnel/v1', '');
    const confirmUrl = new URL(`${wpBase}/hp-funnel-confirm`);
    confirmUrl.searchParams.set('cs', clientSecret);
    
    // The success URL should be our SPA's thank you page
    // We encode it because it's a parameter inside a parameter
    confirmUrl.searchParams.set('succ', returnUrl);
    
    if (publishableKey) {
        confirmUrl.searchParams.set('pk', publishableKey);
    }
    
    return confirmUrl.toString();
  }
};

