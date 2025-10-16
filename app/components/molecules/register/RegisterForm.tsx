"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const RegisterForm = () => {
  return (
    <Card className="w-full max-w-sm shadow-md rounded-2xl border-2 border-gray-500 bg-white">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Create Account ✨</h2>
          <p className="text-gray-500 text-sm mt-2">
            Bergabunglah dan mulai petualanganmu 🚀
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-700">
              Nama Lengkap
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="mt-1 border-2 border-gray-500 rounded-xl focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 border-2 border-gray-500 rounded-xl focus:ring-2 focus:ring-blue-300"
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
              className="mt-1 border-2 border-gray-500 rounded-xl focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <Button
            type="submit"
            className="cursor-pointer w-full bg-blue-300 text-gray-900 font-semibold hover:bg-yellow-500 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Daftar
          </Button>

          <p className="text-center text-sm text-gray-500">
            Sudah punya akun?{" "}
            <a href="/login" className="text-blue-300 font-semibold hover:underline">
              Login
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
