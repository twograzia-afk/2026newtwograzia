
import { NextResponse } from "next/server";

export async function GET() {
    const IKAS_CLIENT_ID = process.env.IKAS_CLIENT_ID;
    const IKAS_CLIENT_SECRET = process.env.IKAS_CLIENT_SECRET;

    try {
        const auth = Buffer.from(`${IKAS_CLIENT_ID}:${IKAS_CLIENT_SECRET}`).toString("base64");
        const response = await fetch("https://api.myikas.com/api/admin/shop", {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: await response.text(), status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message });
    }
}
