import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Calendar, CalendarDays, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Sale } from "@shared/schema";

interface AnalyticsData {
  totalProducts: number;
  stockValue: number;
  monthlySales: number;
  totalRevenue: number;
}

export default function SalesAnalytics() {
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/overview"],
  });

  const { data: recentSales = [], isLoading } = useQuery<Sale[]>({
    queryKey: ["/api/sales/recent"],
  });

  const formatCurrency = (amount: string | number) => {
    return `${Number(amount).toLocaleString()} ETB`;
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const salesStats = [
    {
      title: "Today's Sales",
      value: "3", // This would be calculated from actual data
      change: "+15% from yesterday",
      icon: TrendingUp,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "This Week",
      value: "18", // This would be calculated from actual data
      change: "+8% from last week",
      icon: CalendarDays,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "This Month",
      value: analytics?.monthlySales?.toString() || "0",
      change: "+23% from last month",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(analytics?.totalRevenue || 0),
      change: "+31% this year",
      icon: Banknote,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12" data-testid="sales-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div data-testid="sales-analytics">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground" data-testid="sales-title">
          Sales Analytics
        </h2>
        <p className="text-muted-foreground" data-testid="sales-description">
          Track sales performance and revenue insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {salesStats.map(({ title, value, change, icon: Icon, color, bgColor }, index) => (
          <Card key={index} data-testid={`sales-stat-${index}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm" data-testid={`stat-title-${index}`}>
                    {title}
                  </p>
                  <p className="text-2xl font-bold text-foreground" data-testid={`stat-value-${index}`}>
                    {value}
                  </p>
                  <p className="text-sm text-chart-3" data-testid={`stat-change-${index}`}>
                    {change}
                  </p>
                </div>
                <div className={`${bgColor} p-3 rounded-full`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Sales */}
      <Card data-testid="recent-sales">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="recent-sales-table">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-foreground">Product</th>
                  <th className="text-left p-4 font-medium text-foreground">Customer</th>
                  <th className="text-left p-4 font-medium text-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentSales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <p className="text-muted-foreground" data-testid="no-sales">
                        No recent sales found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  recentSales.map((sale) => (
                    <tr key={sale.id} data-testid={`sale-row-${sale.id}`}>
                      <td className="p-4 text-foreground" data-testid={`sale-date-${sale.id}`}>
                        {formatDate(sale.saleDate)}
                      </td>
                      <td className="p-4 text-foreground" data-testid={`sale-product-${sale.id}`}>
                        Product ID: {sale.productId}
                      </td>
                      <td className="p-4 text-foreground" data-testid={`sale-customer-${sale.id}`}>
                        {sale.customerName || "N/A"}
                      </td>
                      <td className="p-4 text-foreground" data-testid={`sale-amount-${sale.id}`}>
                        {formatCurrency(sale.totalAmount)}
                      </td>
                      <td className="p-4">
                        <span className="bg-chart-3/20 text-chart-3 px-2 py-1 rounded-full text-xs" data-testid={`sale-status-${sale.id}`}>
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
