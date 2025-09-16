import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface AccountSettingsProps {
  user?: User; // user may be undefined initially
}

export const AccountSettings = ({ user }: AccountSettingsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      const [firstName, ...rest] = user.name?.split(" ") || [""];
      setFormData((prev) => ({
        ...prev,
        firstName: firstName || "",
        lastName: rest.join(" "),
        email: user.email,
        phone: user.phone,
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('profileUpdatedSuccessfully'));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }
    toast.success(t('passwordUpdatedSuccessfully'));
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  if (!user) {
    return <div className={`flex items-center justify-center h-64 ${language === "ar" ? "text-right" : ""}`}>
      <p className="text-visa-dark">{t('loadingAccountSettings')}</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold text-visa-dark ${language === "ar" ? "text-right" : ""}`}>{t('accountSettings')}</h1>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3 mb-6" dir={language === "ar" ? "rtl" : "ltr"}>
          <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          <TabsTrigger value="security">{t('security')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle className={language === "ar" ? "text-right" : ""}>{t('personalInformation')}</CardTitle>
                <CardDescription className={language === "ar" ? "text-right" : ""}>
                  {t('personalInformationDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`flex flex-col md:flex-row gap-4 ${language === "ar" ? "md:flex-row-reverse" : ""}`}>
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="firstName" className={language === "ar" ? "text-right block" : ""}>{t('firstName')}</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={language === "ar" ? "text-right" : ""}
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="lastName" className={language === "ar" ? "text-right block" : ""}>{t('lastName')}</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={language === "ar" ? "text-right" : ""}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <Mail className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('emailAddress')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={language === "ar" ? "text-right" : ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <Phone className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('phoneNumber')}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={language === "ar" ? "text-right" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <MapPin className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('address')}
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={language === "ar" ? "text-right" : ""}
                  />
                </div>

                <div className={`flex flex-col md:flex-row gap-4 ${language === "ar" ? "md:flex-row-reverse" : ""}`}>
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="city" className={language === "ar" ? "text-right block" : ""}>{t('city')}</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={language === "ar" ? "text-right" : ""}
                    />
                  </div>
                  <div className="w-full md:w-1/4 space-y-2">
                    <Label htmlFor="state" className={language === "ar" ? "text-right block" : ""}>{t('state')}</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={language === "ar" ? "text-right" : ""}
                    />
                  </div>
                  <div className="w-full md:w-1/4 space-y-2">
                    <Label htmlFor="zipCode" className={language === "ar" ? "text-right block" : ""}>{t('zipCode')}</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={language === "ar" ? "text-right" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <Globe className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('country')}
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={language === "ar" ? "text-right" : ""}
                  />
                </div>
              </CardContent>
              <CardFooter className={language === "ar" ? "justify-start" : ""}>
                <Button
                  type="submit"
                  className="bg-visa-gold hover:bg-visa-gold/90"
                >
                  <Save className={`h-4 w-4 ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('saveChanges')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle className={language === "ar" ? "text-right" : ""}>{t('securitySettings')}</CardTitle>
                <CardDescription className={language === "ar" ? "text-right" : ""}>
                  {t('securitySettingsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className={`flex items-center ${language === "ar" ? "flex-row-reverse text-right" : ""}`}>
                    <Lock className={`h-4 w-4 text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('currentPassword')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={language === "ar" ? "text-right" : ""}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`absolute top-1/2 transform -translate-y-1/2 ${language === "ar" ? "left-2" : "right-2"}`}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className={language === "ar" ? "text-right block" : ""}>{t('newPassword')}</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={language === "ar" ? "text-right" : ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className={language === "ar" ? "text-right block" : ""}>{t('confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={language === "ar" ? "text-right" : ""}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className={language === "ar" ? "justify-start" : ""}>
                <Button
                  type="submit"
                  className="bg-visa-gold hover:bg-visa-gold/90"
                >
                  <Save className={`h-4 w-4 ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('updatePassword')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className={language === "ar" ? "text-right" : ""}>{t('notifications')}</CardTitle>
              <CardDescription className={language === "ar" ? "text-right" : ""}>
                {t('notificationsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className={`text-sm text-muted-foreground ${language === "ar" ? "text-right" : ""}`}>
                {t('notificationSettingsPlaceholder')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
