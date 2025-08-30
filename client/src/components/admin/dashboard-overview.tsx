import { useQuery } from "@tanstack/react-query";
import { Package, DollarSign, TrendingUp, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AnalyticsData {
  totalProducts: number;
  stockValue: number;
  monthlySales: number;
  totalRevenue: number;
}

export default function DashboardOverview() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/overview"],
  });

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ETB`;
  };

  const kpiCards = [
    {
      title: "Total Products",
      value: analytics?.totalProducts || 0,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
      formatter: (value: number) => value.toString(),
    },
    {
      title: "Stock Value",
      value: analytics?.stockValue || 0,
      icon: DollarSign,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      formatter: formatCurrency,
    },
    {
      title: "Sales This Month",
      value: analytics?.monthlySales || 0,
      icon: TrendingUp,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      formatter: (value: number) => value.toString(),
    },
    {
      title: "Revenue",
      value: analytics?.totalRevenue || 0,
      icon: Banknote,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      formatter: formatCurrency,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12" data-testid="dashboard-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div data-testid="dashboard-overview">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground" data-testid="dashboard-title">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground" data-testid="dashboard-description">
          Monitor your business performance and analytics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map(({ title, value, icon: Icon, color, bgColor, formatter }, index) => (
          <Card key={index} data-testid={`kpi-card-${index}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm" data-testid={`kpi-title-${index}`}>
                    {title}
                  </p>
                  <p className="text-2xl font-bold text-foreground" data-testid={`kpi-value-${index}`}>
                    {formatter(value)}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="sales-trend-chart">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/30 rounded flex items-center justify-center">
              <p className="text-muted-foreground">Sales trend chart will be implemented here</p>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="product-categories-chart">
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/30 rounded flex items-center justify-center">
              <p className="text-muted-foreground">Product categories chart will be implemented here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
