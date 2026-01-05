
import { NextResponse } from "next/server";
import { ikasFetch } from "@/lib/services/ikas";

export async function GET() {
    try {
        const query = `
      query {
        shop {
          id
          name
          domain
        }
      }
    `;
        const data = await ikasFetch(query);
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message });
    }
}
