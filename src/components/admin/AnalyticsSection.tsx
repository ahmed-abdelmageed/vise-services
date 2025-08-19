
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Loader } from "lucide-react";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";

interface AnalyticsSectionProps {
  invoices: any[];
  customers: any[];
  tasks: any[];
  isLoading: boolean;
}

export const AnalyticsSection = ({ invoices, customers, tasks, isLoading }: AnalyticsSectionProps) => {
  // Generate analytics data based on real data
  const analyticsData = useMemo(() => {
    if (!invoices?.length || !customers?.length) {
      return {
        revenueData: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Revenue",
              data: [0, 0, 0, 0, 0, 0],
              backgroundColor: "rgba(190, 159, 86, 0.8)",
              borderColor: "rgb(190, 159, 86)",
              borderWidth: 1,
            },
          ],
        },
        clientGrowthData: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "New Clients",
              data: [0, 0, 0, 0, 0, 0],
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        invoiceStatusData: {
          labels: ["Paid", "Unpaid", "In Progress"],
          datasets: [
            {
              data: [0, 0, 0],
              backgroundColor: [
                "rgba(75, 192, 120, 0.8)",
                "rgba(255, 99, 132, 0.8)",
                "rgba(255, 205, 86, 0.8)",
              ],
              borderColor: [
                "rgb(75, 192, 120)",
                "rgb(255, 99, 132)",
                "rgb(255, 205, 86)",
              ],
              borderWidth: 1,
            },
          ],
        }
      };
    }

    // Generate last 6 months labels
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return format(date, 'MMM');
    });

    // Calculate monthly revenue
    const monthlyRevenue = last6Months.map((month, index) => {
      const monthDate = subMonths(startOfMonth(new Date()), 5 - index);
      const nextMonth = subMonths(startOfMonth(new Date()), 4 - index);
      
      return invoices
        .filter(inv => {
          const invDate = parseISO(inv.issue_date);
          return invDate >= monthDate && invDate < nextMonth && inv.status === "Paid";
        })
        .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    });

    // Calculate monthly new clients
    const monthlyNewClients = last6Months.map((month, index) => {
      const monthDate = subMonths(startOfMonth(new Date()), 5 - index);
      const nextMonth = subMonths(startOfMonth(new Date()), 4 - index);
      
      return customers.filter(client => {
        const registerDate = parseISO(client.created_at);
        return registerDate >= monthDate && registerDate < nextMonth;
      }).length;
    });

    // Calculate invoice status counts
    const paidCount = invoices.filter(inv => inv.status === "Paid").length;
    const unpaidCount = invoices.filter(inv => inv.status === "Unpaid").length;
    const inProgressCount = invoices.filter(inv => inv.status === "In Progress").length;

    return {
      revenueData: {
        labels: last6Months,
        datasets: [
          {
            label: "Revenue",
            data: monthlyRevenue,
            backgroundColor: "rgba(190, 159, 86, 0.8)",
            borderColor: "rgb(190, 159, 86)",
            borderWidth: 1,
          },
        ],
      },
      clientGrowthData: {
        labels: last6Months,
        datasets: [
          {
            label: "New Clients",
            data: monthlyNewClients,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
      invoiceStatusData: {
        labels: ["Paid", "Unpaid", "In Progress"],
        datasets: [
          {
            data: [paidCount, unpaidCount, inProgressCount],
            backgroundColor: [
              "rgba(75, 192, 120, 0.8)",
              "rgba(255, 99, 132, 0.8)",
              "rgba(255, 205, 86, 0.8)",
            ],
            borderColor: [
              "rgb(75, 192, 120)",
              "rgb(255, 99, 132)",
              "rgb(255, 205, 86)",
            ],
            borderWidth: 1,
          },
        ],
      }
    };
  }, [invoices, customers, tasks]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-visa-gold mb-4" />
        <p className="text-visa-dark">Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-visa-dark">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-visa-dark">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={analyticsData.revenueData}
              className="h-64"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-visa-dark">Client Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={analyticsData.clientGrowthData}
              className="h-64"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-visa-dark">Invoice Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-64 w-64">
              <PieChart
                data={analyticsData.invoiceStatusData}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
