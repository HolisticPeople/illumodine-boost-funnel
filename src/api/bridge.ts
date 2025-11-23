import { APP_API_BASE, APP_ORIGIN, FUNNEL_ID } from "../config";

const headers = {
  "Content-Type": "application/json"
};

export interface CartItem {
  product_id?: number; // optional if resolving by SKU
  sku: string;
  qty: number;
  // Optional per-line overrides, mirroring Bridge / EAO semantics
  // When true, this line is excluded from any global discount.
  exclude_global_discount?: boolean;
  // When set, this specific item discount percent is applied (e.g. 100 for free).
  item_discount_percent?: number;
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
        address: address,
        items
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Shipping rate error");
    const list = Array.isArray(json) ? json : (json.rates || []);
    return list as ShippingRate[];
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
    // Match fastingkit behavior: use query-param based endpoint to avoid rewrite dependence.
    // Base WP URL (no /wp-json/hp-funnel/v1 suffix)
    const wpBase = APP_API_BASE.replace(/\/wp-json\/hp-funnel\/v1\/?$/, "");
    const u = new URL(wpBase.endsWith("/") ? wpBase : `${wpBase}/`);
    u.searchParams.set("hp_fb_confirm", "1");
    u.searchParams.set("cs", clientSecret);
    // Pass funnel id so Bridge can load per-funnel hosted page styles
    u.searchParams.set("fid", FUNNEL_ID);
    if (publishableKey) {
      u.searchParams.set("pk", publishableKey);
    }
    if (returnUrl) {
      u.searchParams.set("succ", encodeURIComponent(returnUrl));
    }
    return u.toString();
  }
};

