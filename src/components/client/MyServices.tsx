
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flag, Calendar, Users, FileText, Loader } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MyServicesProps {
  applications?: any[];
  loading?: boolean;
}

export const MyServices = ({ applications = [], loading = false }: MyServicesProps) => {
  const { t, language } = useLanguage();
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return t('completed');
      case 'rejected':
        return t('rejected');
      case 'in progress':
        return t('inProgress');
      case 'pending':
        return t('pending');
      default:
        return status || t('pending');
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return t('notAvailable') || 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return t('notAvailable') || 'N/A';
      return date.toLocaleDateString();
    } catch (error) {
      return t('notAvailable') || 'N/A';
    }
  };

  const getSafeValue = (value: any, fallback: string = t('notSpecified')) => {
    return value && value !== '' ? value : fallback;
  };

  // Safe array filtering with null checks
  const safeApplications = Array.isArray(applications) ? applications.filter(app => app && app.id) : [];

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="min-w-0 flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className={language === "ar" ? "text-right" : "text-left"}>
          <h1 className="text-2xl font-bold text-visa-dark">{t('myServices')}</h1>
          <p className="text-gray-500">{t('manageServicesDescription')}</p>
        </div>
        <div className="flex items-center justify-center py-10">
          <Loader className={`w-6 h-6 animate-spin text-visa-gold ${language === "ar" ? "ml-2" : "mr-2"}`} />
          <span className="text-visa-dark">{t('loadingDashboard')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className={language === "ar" ? "text-right" : "text-left"}>
        <h1 className="text-2xl font-bold text-visa-dark">{t('myServices')}</h1>
        <p className="text-gray-500">{t('manageServicesDescription')}</p>
      </div>

      <Tabs defaultValue="active">
        <TabsList dir={language === "ar" ? "rtl" : "ltr"}>
          <TabsTrigger value="active">{t('activeServices')}</TabsTrigger>
          <TabsTrigger value="completed">{t('completedServices')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4 mt-4">
          {safeApplications.filter(app => app.status?.toLowerCase() !== 'completed' && app.status?.toLowerCase() !== 'rejected').length > 0 ? (
            safeApplications
              .filter(app => app.status?.toLowerCase() !== 'completed' && app.status?.toLowerCase() !== 'rejected')
              .map((application) => (
                <Card key={application.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-visa-gold/20">
                  <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className={`flex justify-between items-start gap-4 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                      <div className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                        <CardTitle className="text-lg text-visa-dark font-semibold leading-tight">
                          {application.service_type === "prepare-file-only" ? t('prepareFileOnly') : getSafeValue(application.service_type, "Visa Application")}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1 font-medium">
                          Ref: {getSafeValue(application.reference_id || application.id?.substring(0, 8), 'N/A')}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(application.status)} shrink-0 font-medium`}>
                        {getStatusText(application.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${language === "ar" ? "" : ""}`} dir={language === "ar" ? "rtl" : "ltr"}>
                      <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${language === "ar" ? "flex-row-reverse" : ""}`}>
                        <Flag className="h-5 w-5 text-visa-gold shrink-0" />
                        <div className={`${language === "ar" ? "text-right" : "text-left"} min-w-0`}>
                          <p className="text-sm font-medium text-gray-700">{t('country')}</p>
                          <p className="text-sm text-gray-600 truncate">{getSafeValue(application.country)}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${language === "ar" ? "flex-row-reverse" : ""}`}>
                        <Calendar className="h-5 w-5 text-visa-gold shrink-0" />
                        <div className={`${language === "ar" ? "text-right" : "text-left"} min-w-0`}>
                          <p className="text-sm font-medium text-gray-700">{t('submittedOn')}</p>
                          <p className="text-sm text-gray-600 truncate">{formatDate(application.created_at)}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${language === "ar" ? "flex-row-reverse" : ""}`}>
                        <Users className="h-5 w-5 text-visa-gold shrink-0" />
                        <div className={`${language === "ar" ? "text-right" : "text-left"} min-w-0`}>
                          <p className="text-sm font-medium text-gray-700">{t('travellers')}</p>
                          <p className="text-sm text-gray-600 truncate">
                            {application.adults || 1} {t('adults')}, {application.children || 0} {t('children')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600">{t('noActiveServices')}</h3>
              <p className="text-gray-500 mt-1">{t('noActiveServicesDescription')}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-4">
          {safeApplications.filter(app => app.status?.toLowerCase() === 'completed' || app.status?.toLowerCase() === 'rejected').length > 0 ? (
            safeApplications
              .filter(app => app.status?.toLowerCase() === 'completed' || app.status?.toLowerCase() === 'rejected')
              .map((application) => (
                <Card key={application.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-visa-gold/20">
                  <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className={`flex justify-between items-start gap-4 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                      <div className={`flex-1 ${language === "ar" ? "text-right" : "text-left"}`}>
                        <CardTitle className="text-lg text-visa-dark font-semibold leading-tight">
                          {application.service_type === "prepare-file-only" ? t('prepareFileOnly') : getSafeValue(application.service_type, "Visa Application")}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1 font-medium">
                          Ref: {getSafeValue(application.reference_id || application.id?.substring(0, 8), 'N/A')}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(application.status)} shrink-0 font-medium`}>
                        {getStatusText(application.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${language === "ar" ? "" : ""}`} dir={language === "ar" ? "rtl" : "ltr"}>
                      <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${language === "ar" ? "flex-row-reverse" : ""}`}>
                        <Flag className="h-5 w-5 text-visa-gold shrink-0" />
                        <div className={`${language === "ar" ? "text-right" : "text-left"} min-w-0`}>
                          <p className="text-sm font-medium text-gray-700">{t('country')}</p>
                          <p className="text-sm text-gray-600 truncate">{getSafeValue(application.country)}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${language === "ar" ? "flex-row-reverse" : ""}`}>
                        <Calendar className="h-5 w-5 text-visa-gold shrink-0" />
                        <div className={`${language === "ar" ? "text-right" : "text-left"} min-w-0`}>
                          <p className="text-sm font-medium text-gray-700">{t('completedOn')}</p>
                          <p className="text-sm text-gray-600 truncate">{formatDate(application.updated_at || application.created_at)}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${language === "ar" ? "flex-row-reverse" : ""}`}>
                        <Users className="h-5 w-5 text-visa-gold shrink-0" />
                        <div className={`${language === "ar" ? "text-right" : "text-left"} min-w-0`}>
                          <p className="text-sm font-medium text-gray-700">{t('travellers')}</p>
                          <p className="text-sm text-gray-600 truncate">
                            {application.adults || 1} {t('adults')}, {application.children || 0} {t('children')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600">{t('noCompletedServices')}</h3>
              <p className="text-gray-500 mt-1">{t('noCompletedServicesDescription')}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
