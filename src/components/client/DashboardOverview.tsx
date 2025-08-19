
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  FileText, 
  Ticket, 
  ChevronRight, 
  Headphones,
  Calendar,
  Users
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
}

export const DashboardOverview = ({ user, applications = [] }: DashboardOverviewProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Format application data for display
  const activeServices = applications?.map(app => ({
    id: app.id,
    name: app.service_type || "Visa Application",
    status: app.status || "Active",
    reference: app.reference_id || "",
    country: app.country || "",
    expiresAt: new Date(new Date(app.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })) || [];

  // Mock data for other sections
  const recentInvoices = [
    { id: "INV-2023-078", date: "2023-10-15", amount: "$450", status: "Paid" },
    { id: "INV-2023-082", date: "2023-10-28", amount: "$250", status: "Unpaid" },
  ];

  const openRequests = applications?.length > 0 
    ? applications.map(app => ({
        id: app.reference_id || `REQ-${app.id.substring(0, 8)}`,
        title: `${app.service_type || "Visa"} application status`,
        status: app.status || "In Progress",
        updatedAt: new Date(app.updated_at || app.created_at).toISOString().split('T')[0]
      }))
    : [
        { id: "REQ-2023-045", title: "Visa status inquiry", status: "In Progress", updatedAt: "2023-10-29" },
        { id: "REQ-2023-048", title: "Additional document submission", status: "Pending", updatedAt: "2023-10-30" },
      ];

  const handleBrowseServices = () => {
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-visa-dark">{t('welcome')} {user.name}</h1>
          <p className="text-gray-500">{t('accountOverview')}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-full bg-visa-gold text-white flex items-center justify-center font-medium">
            {user.avatar}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Application summary - new section */}
      {applications && applications.length > 0 && (
        <Card className="bg-gradient-to-r from-visa-light to-visa-dark text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('yourApplications')}</h3>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Package className="h-5 w-5" />
                  <span className="text-2xl font-bold">{applications.length}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('latestReference')}</h3>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FileText className="h-5 w-5" />
                  <span className="text-xl font-mono">
                    {applications[0]?.reference_id || "GVS-00000"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('applicationType')}</h3>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Calendar className="h-5 w-5" />
                  <span className="text-lg">
                    {applications[0]?.service_type || "Visa Service"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Services Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-visa-dark">{t('activeServices')}</CardTitle>
            <Package className="h-4 w-4 text-visa-gold" />
          </CardHeader>
          <CardContent>
            {activeServices.length > 0 ? (
              <div className="space-y-4">
                {activeServices.map((service) => (
                  <div key={service.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                    <p className="font-medium text-sm">{service.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        service.status === "Completed" 
                          ? "bg-green-100 text-green-800" 
                          : service.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {service.status}
                      </span>
                      <span className="text-xs text-gray-500">Ref: {service.reference}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">{t('noActiveServices')}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handleBrowseServices}
                >
                  {t('browseServices')}
                </Button>
              </div>
            )}
            {activeServices.length > 0 && (
              <Button variant="ghost" size="sm" className="w-full mt-3 text-visa-gold">
                {t('viewAll')} <ChevronRight className="ml-1 rtl:mr-1 rtl:ml-0 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Invoices Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-visa-dark">{t('recentInvoices')}</CardTitle>
            <FileText className="h-4 w-4 text-visa-gold" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <p className="font-medium text-sm">{invoice.id}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{invoice.date}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2 rtl:ml-2 rtl:mr-0">{invoice.amount}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        invoice.status === "Paid" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {invoice.status === "Paid" ? t('paid') : t('unpaid')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-3 text-visa-gold">
              {t('viewAll')} <ChevronRight className="ml-1 rtl:mr-1 rtl:ml-0 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Open Requests Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-visa-dark">{t('openRequests')}</CardTitle>
            <Ticket className="h-4 w-4 text-visa-gold" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openRequests.slice(0, 2).map((request) => (
                <div key={request.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <p className="font-medium text-sm">{request.title}</p>
                  <div className="flex justify-between items-center mt-1">
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
                    <span className="text-xs text-gray-500">{t('updated')}: {request.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-3 text-visa-gold">
              {t('viewAll')} <ChevronRight className="ml-1 rtl:mr-1 rtl:ml-0 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-visa-dark border border-gray-200"
            onClick={handleBrowseServices}
          >
            <Package className="h-6 w-6 mb-2" />
            <span>{t('browseServices')}</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-visa-dark border border-gray-200">
            <FileText className="h-6 w-6 mb-2" />
            <span>{t('payInvoice')}</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-visa-dark border border-gray-200">
            <Ticket className="h-6 w-6 mb-2" />
            <span>{t('submitRequest')}</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-visa-dark border border-gray-200">
            <Headphones className="h-6 w-6 mb-2" />
            <span>{t('contactSupport')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
