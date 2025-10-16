"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const LoginForm = () => {
  return (
    <Card className="w-full max-w-sm rounded-2xl border-2 border-gray-500 bg-white">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-500 text-sm mt-2">
            Login to continue your journey 🚀
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 border-2 border-gray-500 rounded-xl focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 border-2 border-gray-500 rounded-xl focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-300 text-gray-900 font-semibold hover:bg-blue-300 rounded-xl transition-all duration-200"
          >
            Login
          </Button>

          <p className="text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <a href="/register" className="text-blue-300 font-semibold hover:underline">
              Daftar
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
