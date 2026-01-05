
import { NextResponse } from "next/server";
import { ikasFetch } from "@/lib/services/ikas";
import { getAdAccountInsights } from "@/lib/services/meta";

export async function GET() {
    const accountId = process.env.META_AD_ACCOUNT_ID!;

    const results = {
        ikas: { status: "pending", data: null as any, error: null as any },
        meta: { status: "pending", data: null as any, error: null as any },
    };

    // 1. Fetch Ikas Orders
    try {
        const ikasQuery = `
      query {
        listOrder(pagination: { limit: 100 }) {
          data {
            totalFinalPrice
            currencyCode
            createdAt
          }
        }
      }
    `;
        const ikasData = await ikasFetch(ikasQuery);

        if (ikasData.errors) {
            throw new Error(JSON.stringify(ikasData.errors));
        }

        const today = new Date().toISOString().split('T')[0];
        const orders = ikasData.data.listOrder.data || [];
        const todayOrders = orders.filter((o: any) => o.createdAt.startsWith(today));
        const todayRevenue = todayOrders.reduce((acc: number, o: any) => acc + (o.totalFinalPrice || 0), 0);

        results.ikas.data = {
            totalOrdersCount: orders.length,
            todayOrders: todayOrders.length,
            todayRevenue: todayRevenue.toFixed(2),
            currency: orders[0]?.currencyCode || "TRY"
        };
        results.ikas.status = "success";
    } catch (err: any) {
        results.ikas.status = "error";
        results.ikas.error = err.message;
    }

    // 2. Fetch Meta Ads Spend for today
    try {
        const metaInsights = await getAdAccountInsights(accountId, "today");
        if (metaInsights && metaInsights.length > 0) {
            results.meta.data = {
                spend: metaInsights[0].spend,
                impressions: metaInsights[0].impressions,
                reach: metaInsights[0].reach
            };
        } else {
            results.meta.data = { spend: 0, impressions: 0, reach: 0 };
        }
        results.meta.status = "success";
    } catch (err: any) {
        results.meta.status = "error";
        results.meta.error = err.message;
    }

    return NextResponse.json(results);
}
