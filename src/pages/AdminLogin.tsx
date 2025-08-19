import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { LockKeyhole, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/language";

const ADMIN_CREDENTIALS = {
  email: "visa@gvsksa.com",
  password: "Global@Visa2024"
};

const AdminLogin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        credentials.email === ADMIN_CREDENTIALS.email &&
        credentials.password === ADMIN_CREDENTIALS.password
      ) {
        setTimeout(() => {
          toast.success(t("login_success"));
          localStorage.setItem("adminAuthenticated", "true");
          navigate("/admin");
        }, 1000);
      } else {
        toast.error(t("invalid_credentials"));
      }
    } catch (error) {
      toast.error(t("login_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto px-4 py-16">
        <Card className="p-6 shadow-lg border-0">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-visa-gold/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-visa-gold" />
            </div>
            <h1 className="text-2xl font-bold text-visa-dark">
              {t("portal_title")}
            </h1>
            <p className="text-gray-500 mt-2">
              {t("restricted_access")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-start">
              <label htmlFor="email" className="text-sm font-medium">
                {t("email_label")}
              </label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder={t("email_placeholder")}
                  required
                  className="pl-10"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <LockKeyhole className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-start">
              <label htmlFor="password" className="text-sm text-start font-medium">
                {t("password_label")}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder={t("password_placeholder")}
                  required
                  className="pl-10"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <LockKeyhole className="h-5 w-5" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-visa-gold hover:bg-visa-gold/90 mt-2"
              disabled={loading}
            >
              {loading ? t("authenticating") : t("login_button")}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
