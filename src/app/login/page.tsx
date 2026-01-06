
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push("/");
                router.refresh();
            } else {
                setError("Geçersiz şifre, lütfen tekrar deneyin.");
            }
        } catch (err) {
            setError("Bir bağlantı hatası oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                        TwoGrazia
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Admin Panel Girişi</p>
                </div>

                <Card className="border-none shadow-2xl bg-white dark:bg-gray-900 overflow-hidden">
                    <div className="h-2 bg-black dark:bg-white" />
                    <CardHeader className="space-y-1 pt-8">
                        <div className="mx-auto bg-gray-100 dark:bg-gray-800 p-3 rounded-full w-fit mb-4">
                            <Lock className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                        <CardTitle className="text-2xl text-center">Hoş Geldiniz</CardTitle>
                        <CardDescription className="text-center">
                            Devam etmek için size verilen şifreyi girin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Şifreniz"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 text-center text-lg tracking-widest border-gray-200 focus:border-black focus:ring-black transition-all"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
                            <Button
                                type="submit"
                                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold transition-all"
                                disabled={loading}
                            >
                                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-gray-400 text-xs mt-8">
                    © 2026 TwoGrazia ERP System. All rights reserved.
                </p>
            </div>
        </div>
    );
}
