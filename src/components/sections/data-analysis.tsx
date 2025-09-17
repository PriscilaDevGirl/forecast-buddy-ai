import { useState } from "react";
import { GradientCard } from "@/components/ui/gradient-card";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Package, 
  MapPin, 
  DollarSign, 
  Calendar,
  Brain,
  Download,
  Code
} from "lucide-react";

interface DataAnalysisProps {
  data: any;
  onStartModeling: () => void;
  onStartPythonTesting: () => void;
}

export function DataAnalysis({ data, onStartModeling, onStartPythonTesting }: DataAnalysisProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for charts
  const salesTrendData = [
    { month: 'Jan', sales: 850000, transactions: 12500 },
    { month: 'Fev', sales: 920000, transactions: 13200 },
    { month: 'Mar', sales: 1150000, transactions: 15800 },
    { month: 'Abr', sales: 980000, transactions: 14100 },
    { month: 'Mai', sales: 1300000, transactions: 17200 },
    { month: 'Jun', sales: 1450000, transactions: 18900 },
    { month: 'Jul', sales: 1380000, transactions: 18100 },
    { month: 'Ago', sales: 1520000, transactions: 19800 },
    { month: 'Set', sales: 1280000, transactions: 16900 },
    { month: 'Out', sales: 1420000, transactions: 18400 },
    { month: 'Nov', sales: 1680000, transactions: 21200 },
    { month: 'Dez', sales: 1850000, transactions: 23100 }
  ];

  const categoryData = [
    { name: 'Distilled Spirits', value: 45, color: 'hsl(var(--chart-1))' },
    { name: 'Wine', value: 25, color: 'hsl(var(--chart-2))' },
    { name: 'Package', value: 15, color: 'hsl(var(--chart-3))' },
    { name: 'Draft', value: 10, color: 'hsl(var(--chart-4))' },
    { name: 'Non-Alcohol', value: 5, color: 'hsl(var(--chart-5))' }
  ];

  const topPdvData = [
    { pdv: 'PDV 1023', sales: 2850000, transactions: 18500 },
    { pdv: 'PDV 1045', sales: 2650000, transactions: 17200 },
    { pdv: 'PDV 1067', sales: 2450000, transactions: 16800 },
    { pdv: 'PDV 1089', sales: 2280000, transactions: 15900 },
    { pdv: 'PDV 1101', sales: 2150000, transactions: 15200 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Análise Exploratória</h2>
          <p className="text-muted-foreground">Insights dos dados históricos de 2022</p>
        </div>
        <Badge variant="secondary" className="text-success">
          Dados Processados
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Faturamento Total"
          value={`R$ ${(data.transactions.totalSales / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          change={{ value: 12.5, type: 'increase' }}
        />
        <StatsCard 
          title="Transações"
          value={data.transactions.rows.toLocaleString()}
          icon={Calendar}
          change={{ value: 8.2, type: 'increase' }}
        />
        <StatsCard 
          title="PDVs Ativos"
          value={data.pdvs.total.toLocaleString()}
          icon={MapPin}
        />
        <StatsCard 
          title="SKUs Únicos"
          value={data.products.total.toLocaleString()}
          icon={Package}
        />
      </div>

      {/* Detailed Analysis */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="locations">Localização</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <GradientCard title="Vendas Mensais 2022" description="Evolução do faturamento ao longo do ano">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GradientCard>

            <GradientCard title="Top 5 PDVs" description="Pontos de venda com maior faturamento">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPdvData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--foreground))" />
                  <YAxis dataKey="pdv" type="category" stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </GradientCard>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <GradientCard title="Análise de Sazonalidade" description="Padrões de vendas ao longo do ano">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Vendas (R$)"
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  name="Transações"
                />
              </LineChart>
            </ResponsiveContainer>
          </GradientCard>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <GradientCard title="Distribuição por Categoria" description="Participação de cada categoria nas vendas">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </GradientCard>

            <GradientCard title="Performance por Categoria" description="Métricas detalhadas por categoria">
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{category.value}%</div>
                      <div className="text-sm text-muted-foreground">
                        R$ {(data.transactions.totalSales * category.value / 100 / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GradientCard>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <StatsCard 
              title="PDVs On Premise"
              value={data.pdvs.onPremise.toLocaleString()}
              icon={MapPin}
            />
            <StatsCard 
              title="PDVs Off Premise"
              value={data.pdvs.offPremise.toLocaleString()}
              icon={MapPin}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-6">
        <Button variant="outline" size="lg">
          <Download className="mr-2 h-5 w-5" />
          Exportar Análise
        </Button>
        <Button 
          onClick={onStartModeling}
          size="lg" 
          className="bg-gradient-primary hover:opacity-90"
        >
          <Brain className="mr-2 h-5 w-5" />
          Modelagem JS
        </Button>
        <Button 
          onClick={onStartPythonTesting}
          size="lg" 
          variant="outline"
        >
          <Code className="mr-2 h-5 w-5" />
          Laboratório Python
        </Button>
      </div>
    </div>
  );
}