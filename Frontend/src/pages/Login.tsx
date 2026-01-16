import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://localhost:8000";

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        const endpoint = isRegister ? "/register" : "/login";

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || "Something went wrong");
            }

            if (isRegister) {
                toast({
                    title: "Registration Successful!",
                    description: "You can now log in.",
                });
                setIsRegister(false);
            } else {
                login(result);
                navigate("/profile");
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageLayout>
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <div className="glass-card w-full max-w-md p-8 rounded-2xl animate-fade-in">
                    <h2 className="text-3xl font-heading font-bold text-center mb-8">
                        {isRegister ? "Join SignSiksha" : "Welcome Back"}
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input
                                {...register("username", { required: "Username is required" })}
                                placeholder="Enter username"
                                className="bg-background/50"
                            />
                            {errors.username && <span className="text-xs text-destructive">{errors.username.message as string}</span>}
                        </div>

                        {/* Optional Email for Register */}
                        {isRegister && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email (Optional)</label>
                                <Input
                                    {...register("email")}
                                    placeholder="Enter email"
                                    type="email"
                                    className="bg-background/50"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                {...register("password", { required: "Password is required" })}
                                type="password"
                                placeholder="Enter password"
                                className="bg-background/50"
                            />
                            {errors.password && <span className="text-xs text-destructive">{errors.password.message as string}</span>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading} variant="hero">
                            {isLoading ? "Please wait..." : (isRegister ? "Create Account" : "Login")}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {isRegister ? "Already have an account?" : "New to SignSiksha?"}{" "}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-primary hover:underline font-bold"
                            >
                                {isRegister ? "Login here" : "Sign up here"}
                            </button>
                        </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-border/50 text-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground text-xs"
                            onClick={async () => {
                                // Demo Seed Logic
                                try {
                                    setIsLoading(true);
                                    // 1. Try Register
                                    await fetch(`${API_URL}/register`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ username: "oraon", password: "test@01", email: "oraon@test.com" })
                                    });
                                    // 2. Login
                                    const res = await fetch(`${API_URL}/login`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ username: "oraon", password: "test@01" })
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        login(data);
                                        toast({ title: "Demo User Loaded", description: "Logged in as 'oraon'" });
                                        navigate("/profile");
                                    } else {
                                        throw new Error(data.detail);
                                    }
                                } catch (e: any) {
                                    toast({ variant: "destructive", title: "Demo Failed", description: e.message });
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                        >
                            Demo Mode: Load 'oraon'
                        </Button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Login;
