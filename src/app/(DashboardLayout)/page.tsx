
import React from "react";
import { getDashboardStats, getInventory, getCustomers } from "@/lib/services/ikas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Users, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
  title: "TwoGrazia Admin | Dashboard",
  description: "Luxury Jewelry ERP Dashboard",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let orders = [];
  let products = [];
  let customers = [];

  try {
    const ordersData = await getDashboardStats();
    const inventoryData = await getInventory();
    const customersData = await getCustomers();

    orders = ordersData?.data || [];
    products = inventoryData?.data || [];
    customers = customersData?.data || [];
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
  }

  const stats = [
    {
      title: "Recent Orders",
      value: orders.length,
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "text-primary",
      bg: "bg-lightprimary",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: <Package className="w-6 h-6" />,
      color: "text-success",
      bg: "bg-lightsuccess",
    },
    {
      title: "Total Customers",
      value: customers.length,
      icon: <Users className="w-6 h-6" />,
      color: "text-secondary",
      bg: "bg-lightsecondary",
    },
    {
      title: "Low Stock Items",
      value: products.filter((p: any) =>
        p.variants?.some((v: any) => v.stocks?.some((s: any) => s.stock < 5))
      ).length,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "text-error",
      bg: "bg-lighterror",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, TwoGrazia Admin</h1>
        <p className="text-muted-foreground">Manage your luxury jewelry business and Ikas ERP data.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-8 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/ikas/orders" className="text-primary text-sm font-medium hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "COMPLETED" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.totalFinalPrice} {order.currencyCode}
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Links / Actions */}
        <Card className="lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/ikas/inventory" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
              <div className="p-2 bg-lightprimary text-primary rounded-lg">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Manage Inventory</p>
                <p className="text-xs text-muted-foreground">Update stock and prices</p>
              </div>
            </Link>
            <Link href="/ikas/customers" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
              <div className="p-2 bg-lightsuccess text-success rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Customers</p>
                <p className="text-xs text-muted-foreground">View client database</p>
              </div>
            </Link>
            <Link href="/auth/profile" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
              <div className="p-2 bg-lightsecondary text-secondary rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Account Settings</p>
                <p className="text-xs text-muted-foreground">Security and profile</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
