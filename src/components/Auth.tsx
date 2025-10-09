import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export const Auth = ({
  onSuccess,
  redirectTo = "/client-dashboard",
}: AuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error(t("invalidEmail") || "Please enter a valid email address");
      return;
    }

    if (email === "visa@gvsksa.com") {
      toast.error(t("invalidEmail") || "Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      toast.error(
        t("shortPassword") || "Password must be at least 6 characters long"
      );
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      localStorage.setItem("userData", JSON.stringify(data.user));
      toast.success(t("signInSuccess") || "Signed in successfully!");

      console.log("🚀 ~ handleSignIn ~ redirectTo:", redirectTo);
      if (onSuccess) {
        onSuccess();
      }
      navigate(redirectTo);
    } catch (error: any) {
      // if (
      //   error.message?.includes("Invalid login credentials") ||
      //   error.message?.includes("User not found")
      // ) {
      //   try {
      //     toast.info(t("creatingAccount") || "Creating new account...");
      //     const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      //       email,
      //       password,
      //       options: { data: { name: email.split("@")[0] } },
      //     });

      //     if (signUpError) throw signUpError;

      //     localStorage.setItem("userData", JSON.stringify(signUpData.user));
      //     toast.success(t("accountCreated") || "Account created and logged in successfully!");
      //     navigate(redirectTo);
      //   } catch (signUpError: any) {
      //     toast.error(signUpError.message || t("accountCreationError") || "Failed to create account");
      //     console.error("Error creating account:", signUpError);
      //   }
      // } else {
      toast.error(error.message || t("signInError") || "Failed to sign in");
      console.error("Error signing in:", error);
      // }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSignIn} className="space-y-4">
        <h2 className="text-2xl font-bold text-visa-dark mb-4">
          {t("signIn")}
        </h2>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("emailAddress") || "Email Address"}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("enterEmail") || "Enter your email"}
            className="w-full"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("password") || "Password"}
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("enterPassword") || "Enter your password"}
            className="w-full"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-visa-gold hover:bg-visa-gold/90 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              {t("signingIn") || "Signing in..."}
            </>
          ) : (
            t("signIn")
          )}
        </Button>
      </form>
    </div>
  );
};
