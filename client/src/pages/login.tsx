"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogIn, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginRequest } from "@shared/schema";

export default function Login() {
  const { toast } = useToast();
  const [needsSetup, setNeedsSetup] = useState(false);

  // Check if first-time setup is required
  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("/api/setup/check");
        const data = await res.json();
        setNeedsSetup(data.needsSetup);
      } catch (err) {
        console.error("Failed to check admin:", err);
      }
    }
    checkAdmin();
  }, []);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Login successful! Redirecting...",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Smartphone className="h-12 w-12 text-white mr-2" />
            <h1 className="text-4xl font-bold text-white">Nur Mobile</h1>
          </div>
          <p className="text-white/80 text-lg">Admin Login Portal</p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            {needsSetup && (
              <div className="text-center mt-4">
                <p className="text-white/80 mb-2">No admin account found.</p>
                <Button onClick={() => (window.location.href = "/setup")} className="w-full">
                  Create Admin Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">© 2024 Nur Mobile. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
