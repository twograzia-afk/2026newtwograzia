
const IKAS_CLIENT_ID = process.env.IKAS_CLIENT_ID;
const IKAS_CLIENT_SECRET = process.env.IKAS_CLIENT_SECRET;
const IKAS_API_URL = process.env.IKAS_API_URL || "https://api.ikas.com/v1";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

const IKAS_TOKEN_URL = "https://api.myikas.com/api/admin/oauth/token";
const IKAS_SHOP_ID = process.env.IKAS_SHOP_ID;
const IKAS_STOREFRONT_ID = process.env.IKAS_STOREFRONT_ID;

async function getIkasToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch(IKAS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: IKAS_CLIENT_ID!,
      client_secret: IKAS_CLIENT_SECRET!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.log("Ikas Token Error:", error);
    throw new Error(`Failed to fetch Ikas token: ${error}`);
  }

  const data = await response.json();
  console.log("IKAS DEBUG - TOKEN:", JSON.stringify(data));
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

export async function ikasFetch(query: string, variables = {}) {
  const token = await getIkasToken();
  const response = await fetch(`${IKAS_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-ikas-shop-id": IKAS_SHOP_ID!,
      "x-ikas-merchant-id": IKAS_SHOP_ID!,
      "x-ikas-storefront-id": IKAS_STOREFRONT_ID!,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.log("Ikas GQL Error:", error);
    throw new Error(`Ikas API error: ${error}`);
  }

  return response.json();
}

export async function getDashboardStats() {
  const query = `
    query {
      listOrder(pagination: { limit: 10 }) {
        data {
          id
          orderNumber
          totalFinalPrice
          currencyCode
          createdAt
          status
        }
      }
    }
  `;

  try {
    const data = await ikasFetch(query);
    return data.data.listOrder;
  } catch (error) {
    console.error("Error fetching Ikas stats:", error);
    return null;
  }
}
