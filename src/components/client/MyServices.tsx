
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flag, Calendar, Users, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MyServicesProps {
  applications?: any[];
}

export const MyServices = ({ applications = [] }: MyServicesProps) => {
  const { t } = useLanguage();
  
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
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-visa-dark">{t('myServices')}</h1>
        <p className="text-gray-500">{t('manageServicesDescription')}</p>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">{t('activeServices')}</TabsTrigger>
          <TabsTrigger value="completed">{t('completedServices')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4 mt-4">
          {applications.filter(app => app.status?.toLowerCase() !== 'completed' && app.status?.toLowerCase() !== 'rejected').length > 0 ? (
            applications
              .filter(app => app.status?.toLowerCase() !== 'completed' && app.status?.toLowerCase() !== 'rejected')
              .map((application) => (
                <Card key={application.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-visa-dark">
                          {application.service_type || "Visa Application"}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Ref: {application.reference_id || application.id.substring(0, 8)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status || "Pending"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Flag className="h-5 w-5 text-visa-gold mr-2" />
                        <div>
                          <p className="text-sm font-medium">{t('country')}</p>
                          <p className="text-sm text-gray-500">{application.country || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-visa-gold mr-2" />
                        <div>
                          <p className="text-sm font-medium">{t('submittedOn')}</p>
                          <p className="text-sm text-gray-500">{formatDate(application.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-visa-gold mr-2" />
                        <div>
                          <p className="text-sm font-medium">{t('travellers')}</p>
                          <p className="text-sm text-gray-500">
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
          {applications.filter(app => app.status?.toLowerCase() === 'completed' || app.status?.toLowerCase() === 'rejected').length > 0 ? (
            applications
              .filter(app => app.status?.toLowerCase() === 'completed' || app.status?.toLowerCase() === 'rejected')
              .map((application) => (
                <Card key={application.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-visa-dark">
                          {application.service_type || "Visa Application"}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Ref: {application.reference_id || application.id.substring(0, 8)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status || "Completed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Flag className="h-5 w-5 text-visa-gold mr-2" />
                        <div>
                          <p className="text-sm font-medium">{t('country')}</p>
                          <p className="text-sm text-gray-500">{application.country || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-visa-gold mr-2" />
                        <div>
                          <p className="text-sm font-medium">{t('completedOn')}</p>
                          <p className="text-sm text-gray-500">{formatDate(application.updated_at || application.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-visa-gold mr-2" />
                        <div>
                          <p className="text-sm font-medium">{t('travellers')}</p>
                          <p className="text-sm text-gray-500">
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
