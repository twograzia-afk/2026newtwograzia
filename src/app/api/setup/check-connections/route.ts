
import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/services/ikas";
import { getAdAccounts } from "@/lib/services/meta";

export async function GET() {
    const results = {
        ikas: { status: "pending", data: null as any, error: null as any },
        meta: { status: "pending", data: null as any, error: null as any },
    };

    try {
        const ikasData = await getDashboardStats();
        results.ikas.status = "success";
        results.ikas.data = ikasData;
    } catch (err: any) {
        results.ikas.status = "error";
        results.ikas.error = err.message;
    }

    try {
        const metaData = await getAdAccounts();
        results.meta.status = "success";
        results.meta.data = metaData;
    } catch (err: any) {
        results.meta.status = "error";
        results.meta.error = err.message;
    }

    return NextResponse.json(results);
}
