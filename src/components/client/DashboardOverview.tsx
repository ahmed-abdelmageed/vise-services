import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  FileText,
  Ticket,
  ChevronRight,
  ChevronLeft,
  Headphones,
  Calendar,
  Users,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface DashboardOverviewProps {
  user: User;
  applications?: any[];
  onSectionChange: (section: string) => void;
}

export const DashboardOverview = ({
  user,
  applications = [],
  onSectionChange,
}: DashboardOverviewProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Format application data for display
  const activeServices =
    applications?.map((app) => ({
      id: app.id,
      name: app.service_type || "Visa Application",
      status: app.status || "Active",
      reference: app.reference_id || "",
      country: app.country || "",
      expiresAt: new Date(
        new Date(app.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
    })) || [];

  // Mock data for other sections
  const recentInvoices = [
    { id: "INV-2023-078", date: "2023-10-15", amount: "$450", status: "Paid" },
    {
      id: "INV-2023-082",
      date: "2023-10-28",
      amount: "$250",
      status: "Unpaid",
    },
  ];

  const openRequests =
    applications?.length > 0
      ? applications.map((app) => ({
          id: app.reference_id || `REQ-${app.id.substring(0, 8)}`,
          title: `${app.service_type || "Visa"} ${t("visaApplicationStatus")}`,
          status: app.status || "In Progress",
          updatedAt: new Date(app.updated_at || app.created_at)
            .toISOString()
            .split("T")[0],
        }))
      : [
          {
            id: "REQ-2023-045",
            title: t("visaStatusInquiry"),
            status: "In Progress",
            updatedAt: "2023-10-29",
          },
          {
            id: "REQ-2023-048",
            title: t("additionalDocumentSubmission"),
            status: "Pending",
            updatedAt: "2023-10-30",
          },
        ];

  const handleBrowseServices = () => {
    navigate("/");
  };

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <div
        className={`flex flex-col md:flex-row justify-between items-start md:items-center ${
          language === "ar" ? "md:flex-row-reverse" : ""
        }`}
      >
        <div
          className={`mt-4 md:mt-0 flex items-center gap-3 ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-visa-gold to-visa-dark text-white flex items-center justify-center font-semibold text-lg shadow-md">
            {user.avatar}
          </div>
          <div className={language === "ar" ? "text-right" : "text-left"}>
            <p
              className={`font-semibold text-visa-dark ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {user.name}
            </p>
            <p
              className={`text-sm text-gray-500 ${
                language === "ar" ? "text-left" : "text-left"
              }`}
            >
              {user.email}
            </p>
          </div>
        </div>
        <div className={language === "ar" ? "text-right" : "text-left"}>
          <h1
            className={`text-2xl font-bold text-visa-dark ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t("welcome")} {user.name}
          </h1>
          <p
            className={`text-gray-500 mt-1 ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t("accountOverview")}
          </p>
        </div>
      </div>

      {/* Application summary - new section */}
      {applications && applications.length > 0 && (
        <Card className="bg-gradient-to-r from-visa-light to-visa-dark text-white shadow-xl border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`space-y-3 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>{t("yourApplications")}</span>
                  <Package className="h-5 w-5" />
                </h3>
                <div
                  className={`flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1 backdrop-blur-sm`}
                >
                  <span className="text-3xl font-bold">
                    {applications.length}
                  </span>
                  <span className="text-sm opacity-90">
                    {applications.length > 1
                      ? t("Applications")
                      : t("Application")}
                  </span>
                </div>
              </div>

              <div
                className={`space-y-3 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {language === "ar" ? (
                    <>
                      <span>{t("latestReference")}</span>
                      <FileText className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      <span>{t("latestReference")}</span>
                    </>
                  )}
                </h3>
                <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
                  <span className="text-xl font-mono font-semibold">
                    {applications[0]?.reference_id || "GVS-00000"}
                  </span>
                </div>
              </div>

              <div
                className={`space-y-3 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {language === "ar" ? (
                    <>
                      <span>{t("applicationType")}</span>
                      <Calendar className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      <Calendar className="h-5 w-5" />
                      <span>{t("applicationType")}</span>
                    </>
                  )}
                </h3>
                <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
                  <span className="text-lg font-medium">
                    {applications[0]?.service_type === "prepare-file-only"
                      ? t("prepareFileOnly")
                      : applications[0]?.service_type || "Visa Service"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
          language === "ar" ? "" : ""
        }`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {/* Active Services Card */}
        <Card className="bg-white hover:shadow-lg transition-shadow duration-200 border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <div
              className={`flex items-center gap-2 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle
                className={`text-base font-semibold text-gray-900 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t("activeServices")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {activeServices.length > 0 ? (
              <div className="space-y-4">
                {activeServices.map((service) => (
                  <div
                    key={service.id}
                    className="border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <p
                      className={`font-medium text-sm ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {service.name}
                    </p>
                    <div
                      className={`flex justify-between items-center mt-1 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          service.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : service.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {service.status}
                      </span>
                      <span
                        className={`text-xs text-gray-500 ${
                          language === "ar" ? "text-right" : "text-left"
                        }`}
                      >
                        Ref: {service.reference}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`text-center py-6 ${
                  language === "ar" ? "text-center" : "text-center"
                }`}
              >
                <p className="text-gray-500">{t("noActiveServices")}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleBrowseServices}
                >
                  {t("browseServices")}
                </Button>
              </div>
            )}
            {activeServices.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className={`w-full mt-3 ${
                  language === "ar" ? "flex-row-reverse" : ""
                } text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2`}
                onClick={() => onSectionChange("services")}
              >
                <span>{t("viewAll")}</span>
                {language === "ar" ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Invoices Card */}
        <Card className="bg-white hover:shadow-lg transition-shadow duration-200 border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <div
              className={`flex items-center gap-2 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle
                className={`text-base font-semibold text-gray-900 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t("recentInvoices")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <p
                    className={`font-medium text-sm ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {invoice.id}
                  </p>
                  <div
                    className={`flex justify-between items-center mt-1 ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span
                      className={`text-xs text-gray-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {invoice.date}
                    </span>
                    <div
                      className={`flex items-center gap-2 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {invoice.amount}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {invoice.status === "Paid" ? t("paid") : t("unpaid")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full mt-3 ${
                language === "ar" ? "flex-row-reverse" : ""
              } text-green-600 hover:text-green-700 hover:bg-green-50 gap-2`}
              onClick={() => onSectionChange("invoices")}
            >
              <span>{t("viewAll")}</span>
              {language === "ar" ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Open Requests Card */}
        {/* <Card className="bg-white hover:shadow-lg transition-shadow duration-200 border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <div className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <div className="p-2 bg-orange-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle className={`text-base font-semibold text-gray-900 ${language === "ar" ? "text-right" : "text-left"}`}>
                {t('openRequests')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openRequests.slice(0, 2).map((request) => (
                <div key={request.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <p className={`font-medium text-sm ${language === "ar" ? "text-right" : "text-left"}`}>{request.title}</p>
                  <div className={`flex justify-between items-center mt-1 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      request.status === "In Progress" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : request.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : request.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {request.status === "In Progress" ? t('inProgress') : request.status}
                    </span>
                    <span className={`text-xs text-gray-500 ${language === "ar" ? "text-right" : "text-left"}`}>{t('updated')}: {request.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`w-full mt-3 ${language === "ar" ? "flex-row-reverse" : ""} text-orange-600 hover:text-orange-700 hover:bg-orange-50 gap-2`}
              onClick={() => onSectionChange('support')}
            >
              <span>{t('viewAll')}</span>
              {language === "ar" ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CardContent>
        </Card> */}
      </div>

      {/* Quick Actions Section */}
      {/* <div className="mt-8">
        <h2 className={`text-xl font-bold mb-6 text-gray-900 ${language === "ar" ? "text-right" : "text-left"}`}>
          {t('quickActions')}
        </h2>
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${language === "ar" ? "" : ""}`} dir={language === "ar" ? "rtl" : "ltr"}>
          <Button 
            className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:shadow-md transition-all duration-200 gap-2"
            onClick={handleBrowseServices}
          >
            <Package className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium">{t('browseServices')}</span>
          </Button>
          <Button 
            className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:shadow-md transition-all duration-200 gap-2"
            onClick={() => onSectionChange('invoices')}
          >
            <FileText className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium">{t('payInvoice')}</span>
          </Button>
          <Button 
            className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:shadow-md transition-all duration-200 gap-2"
            onClick={() => onSectionChange('support')}
          >
            <Ticket className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-medium">{t('submitRequest')}</span>
          </Button>
          <Button 
            className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:shadow-md transition-all duration-200 gap-2"
            onClick={() => onSectionChange('support')}
          >
            <Headphones className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium">{t('contactSupport')}</span>
          </Button>
        </div>
      </div> */}
    </div>
  );
};
