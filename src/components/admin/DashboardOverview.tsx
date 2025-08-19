
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, CreditCard, Download, FileText, Loader, User, FileCheck, Eye, TrendingUp, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { VisaApplication, ClientInvoice, ApplicationStatus } from "@/types/crm";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardOverviewProps {
  isLoading: boolean;
  onDataChanged?: () => Promise<void>;
}

export const DashboardOverview = ({ isLoading: propsLoading, onDataChanged }: DashboardOverviewProps) => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // Fetch real data from Supabase
  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['dashboard-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visa_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as VisaApplication[];
    },
  });

  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['dashboard-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_invoices')
        .select('*, client:client_id(first_name, last_name)')
        .order('issue_date', { ascending: false });
      
      if (error) throw error;
      return data as (ClientInvoice & { client: { first_name: string, last_name: string } })[];
    },
  });

  const { data: statusUpdates, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['dashboard-status-updates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('application_status')
        .select('*, application:application_id(first_name, last_name)')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as (ApplicationStatus & { application: { first_name: string, last_name: string } })[];
    },
  });

  const completeApplicationMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      // Insert a new status record
      const { error: statusError } = await supabase
        .from('application_status')
        .insert([{
          application_id: applicationId,
          status: 'Completed',
          notes: 'Marked as completed from dashboard',
          updated_by: 'Admin'
        }]);
      
      if (statusError) throw statusError;
      
      // Update the main application status
      const { error: appError } = await supabase
        .from('visa_applications')
        .update({ status: 'Completed' })
        .eq('id', applicationId);
      
      if (appError) throw appError;
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-status-updates'] });
      toast.success(t("success"));
      
      if (onDataChanged) {
        onDataChanged();
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("error"));
    },
  });

  const isLoading = isLoadingApplications || isLoadingInvoices || isLoadingStatus || propsLoading;

  // Calculate total revenue and other metrics
  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(app => app.status !== "Completed" && app.status !== "Rejected").length || 0;
  const totalInvoices = invoices?.length || 0;
  const unpaidInvoices = invoices?.filter(inv => inv.status === "Unpaid").length || 0;
  
  // Calculate total revenue (sum of all paid invoices)
  const totalRevenue = invoices
    ?.filter(inv => inv.status === "Paid")
    .reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
  
  // Total value of pending applications 
  const pendingRevenue = applications
    ?.filter(app => app.status !== "Completed" && app.status !== "Rejected")
    .reduce((sum, app) => sum + Number(app.total_price), 0) || 0;

  // Filter data for the various cards
  const paidInvoices = invoices?.filter(invoice => invoice.status === "Paid")
    .sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())
    .slice(0, 3) || [];
  
  const inProgressApplications = applications?.filter(app => app.status === "In Progress" || app.status === "Document Review")
    .sort((a, b) => new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime())
    .slice(0, 3) || [];
  
  const pendingPayments = invoices?.filter(invoice => invoice.status === "Unpaid")
    .sort((a, b) => new Date(a.due_date || "").getTime() - new Date(b.due_date || "").getTime())
    .slice(0, 3) || [];
  
  const completedApplications = applications?.filter(app => app.status === "Completed")
    .sort((a, b) => new Date(b.updated_at || "").getTime() - new Date(a.updated_at || "").getTime())
    .slice(0, 3) || [];
  
  const recentStatusUpdates = statusUpdates?.slice(0, 3) || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('noData');
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (e) {
      return t('invalidDate');
    }
  };

  const handleCompleteApplication = (id: string) => {
    completeApplicationMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-visa-gold mb-4" />
        <p className="text-visa-dark">{t('loadingDashboard')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-visa-dark">{t('dashboard')}</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('totalApplications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-gray-500 mt-1">{t('allTime')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('pendingApplications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications}</div>
            <p className="text-xs text-gray-500 mt-1">{t('awaitingProcessing')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('totalRevenue')}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-500 mr-1" />
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} SAR</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('potentialRevenue')}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <TrendingUp className="h-5 w-5 text-visa-gold mr-1" />
            <div className="text-2xl font-bold">{pendingRevenue.toLocaleString()} SAR</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Paid Invoices Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-visa-dark">{t('recentPaidInvoices')}</CardTitle>
            <FileText className="h-4 w-4 text-visa-gold" />
          </CardHeader>
          <CardContent>
            {paidInvoices.length > 0 ? (
              <ul className="divide-y">
                {paidInvoices.map((invoice) => (
                  <li key={invoice.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {invoice.client?.first_name} {invoice.client?.last_name || ''}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(invoice.issue_date)}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-3">{invoice.amount} {invoice.currency}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 py-3 text-center">{t('noPaidInvoices')}</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Status Updates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-visa-dark">{t('recentStatusUpdates')}</CardTitle>
            <FileCheck className="h-4 w-4 text-visa-gold" />
          </CardHeader>
          <CardContent>
            {recentStatusUpdates.length > 0 ? (
              <ul className="divide-y">
                {recentStatusUpdates.map((status) => (
                  <li key={status.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {status.application?.first_name} {status.application?.last_name || ''}
                        </p>
                        <div className="flex items-center mt-1">
                          <StatusBadge status={status.status} />
                          <span className="text-xs text-gray-500 ml-2">
                            {formatDate(status.updated_at)}
                          </span>
                        </div>
                      </div>
                      {status.notes && (
                        <Button variant="ghost" size="sm" className="h-7">
                          <Eye className="h-3 w-3 mr-1" /> {t('notes')}
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 py-3 text-center">{t('noStatusUpdates')}</p>
            )}
          </CardContent>
        </Card>

        {/* In Progress Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-visa-dark">{t('inProgressApplications')}</CardTitle>
            <Clock className="h-4 w-4 text-visa-gold" />
          </CardHeader>
          <CardContent>
            {inProgressApplications.length > 0 ? (
              <ul className="divide-y">
                {inProgressApplications.map((app) => (
                  <li key={app.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {app.first_name} {app.last_name || ''}
                      </p>
                      <div className="flex items-center mt-1">
                        <StatusBadge status={app.status || 'In Progress'} />
                        <span className="text-xs text-gray-500 ml-2">
                          {t('created')}: {formatDate(app.created_at)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs"
                      onClick={() => handleCompleteApplication(app.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t('complete')}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 py-3 text-center">{t('noApplicationsInProgress')}</p>
            )}
          </CardContent>
        </Card>

        {/* Pending Payments Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-visa-dark">{t('pendingPayments')}</CardTitle>
            <CreditCard className="h-4 w-4 text-visa-gold" />
          </CardHeader>
          <CardContent>
            {pendingPayments.length > 0 ? (
              <ul className="divide-y">
                {pendingPayments.map((payment) => (
                  <li key={payment.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {payment.client?.first_name} {payment.client?.last_name || ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.invoice_number} - {payment.amount} {payment.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-500">
                        {t('due')}: {formatDate(payment.due_date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 py-3 text-center">{t('noPendingPayments')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
