
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_API_VERSION = "v19.0"; // Or current
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export async function metaFetch(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${META_BASE_URL}/${endpoint}`);
    url.searchParams.append("access_token", META_ACCESS_TOKEN!);

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Meta API error: ${error}`);
    }

    return response.json();
}

export async function getAdAccounts() {
    try {
        const data = await metaFetch("me/adaccounts", {
            fields: "name,account_id,id,currency",
        });
        return data.data;
    } catch (error) {
        console.error("Error fetching Meta ad accounts:", error);
        return null;
    }
}

export async function getAdAccountInsights(adAccountId: string, datePreset = "today") {
    try {
        const data = await metaFetch(`${adAccountId}/insights`, {
            fields: "spend,impressions,clicks,reach",
            date_preset: datePreset,
        });
        return data.data;
    } catch (error) {
        console.error("Error fetching Meta insights:", error);
        return null;
    }
}
