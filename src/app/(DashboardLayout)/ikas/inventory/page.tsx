
import React from "react";
import { getInventory } from "@/lib/services/ikas";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default async function InventoryPage() {
    const inventoryData = await getInventory();
    const products = inventoryData?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Products from Ikas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="text-right">Stock</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length > 0 ? (
                                products.map((product: any) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            {product.mainImage?.url ? (
                                                <Image
                                                    src={product.mainImage.url}
                                                    alt={product.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-muted rounded-md" />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.variants?.[0]?.sku || "N/A"}</TableCell>
                                        <TableCell className="text-right">
                                            {product.variants?.[0]?.stocks?.[0]?.stock ?? 0}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                        No products found or API error.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
