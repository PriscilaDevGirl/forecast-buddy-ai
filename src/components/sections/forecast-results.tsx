import { useState, useCallback } from "react";
import { GradientCard } from "@/components/ui/gradient-card";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { 
  Download, 
  FileText, 
  Search, 
  Filter,
  Calendar,
  Target,
  TrendingUp,
  Package,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ForecastResultsProps {
  forecastData: any[];
}

export function ForecastResults({ forecastData }: ForecastResultsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const { toast } = useToast();

  // Process forecast data for visualizations
  const processedData = forecastData || [];
  
  const weeklyTotals = [1, 2, 3, 4, 5].map(week => ({
    week: `Semana ${week}`,
    quantidade: processedData
      .filter(item => item.semana === week)
      .reduce((sum, item) => sum + item.quantidade, 0),
    pdvs: new Set(processedData.filter(item => item.semana === week).map(item => item.pdv)).size,
    skus: new Set(processedData.filter(item => item.semana === week).map(item => item.produto)).size
  }));

  const topPdvs = Object.entries(
    processedData.reduce((acc: any, item) => {
      if (!acc[item.pdv]) acc[item.pdv] = 0;
      acc[item.pdv] += item.quantidade;
      return acc;
    }, {})
  )
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10)
    .map(([pdv, quantidade]: any) => ({ pdv, quantidade }));

  const topProducts = Object.entries(
    processedData.reduce((acc: any, item) => {
      if (!acc[item.produto]) acc[item.produto] = 0;
      acc[item.produto] += item.quantidade;
      return acc;
    }, {})
  )
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10)
    .map(([produto, quantidade]: any) => ({ produto, quantidade }));

  const totalQuantity = processedData.reduce((sum, item) => sum + item.quantidade, 0);
  const uniquePdvs = new Set(processedData.map(item => item.pdv)).size;
  const uniqueProducts = new Set(processedData.map(item => item.produto)).size;

  const filteredData = processedData.filter(item => {
    const matchesSearch = !searchTerm || 
      item.pdv.toString().includes(searchTerm) || 
      item.produto.toString().includes(searchTerm);
    const matchesWeek = !selectedWeek || item.semana === selectedWeek;
    return matchesSearch && matchesWeek;
  });

  const exportToCsv = useCallback(() => {
    const csvContent = [
      "semana;pdv;produto;quantidade",
      ...processedData.map(item => 
        `${item.semana};${item.pdv};${item.produto};${item.quantidade}`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "previsoes_janeiro_2023.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download iniciado",
      description: "Arquivo CSV com as previsões foi gerado.",
    });
  }, [processedData, toast]);

  const exportToParquet = useCallback(() => {
    // Mock parquet export (in real implementation, you'd use a library like Apache Arrow)
    toast({
      title: "Formato Parquet",
      description: "Implementação de exportação Parquet disponível na versão final.",
    });
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Resultados da Previsão</h2>
          <p className="text-muted-foreground">Previsões de vendas para Janeiro 2023</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-success">
            {processedData.length.toLocaleString()} previsões
          </Badge>
          <Badge variant="outline">
            5 semanas
          </Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Quantidade Total"
          value={totalQuantity.toLocaleString()}
          icon={Target}
        />
        <StatsCard 
          title="PDVs Únicos"
          value={uniquePdvs}
          icon={MapPin}
        />
        <StatsCard 
          title="SKUs Únicos"
          value={uniqueProducts}
          icon={Package}
        />
        <StatsCard 
          title="Média Semanal"
          value={(totalQuantity / 5).toFixed(0)}
          icon={Calendar}
        />
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={exportToCsv} size="lg" className="bg-gradient-primary hover:opacity-90">
          <Download className="mr-2 h-5 w-5" />
          Exportar CSV
        </Button>
        <Button onClick={exportToParquet} variant="outline" size="lg">
          <FileText className="mr-2 h-5 w-5" />
          Exportar Parquet
        </Button>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="ranking">Rankings</TabsTrigger>
          <TabsTrigger value="table">Tabela Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <GradientCard title="Previsões por Semana" description="Distribuição das vendas ao longo de Janeiro 2023">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyTotals}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="quantidade" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </GradientCard>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <GradientCard title="Evolução Semanal" description="Tendência das previsões ao longo das semanas">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTotals}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--foreground))" />
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
                  dataKey="quantidade" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </GradientCard>
        </TabsContent>

        <TabsContent value="ranking" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <GradientCard title="Top 10 PDVs" description="Maiores previsões por ponto de venda">
              <div className="space-y-3">
                {topPdvs.map((item, index) => (
                  <div key={item.pdv} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">PDV {item.pdv}</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {item.quantidade.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </GradientCard>

            <GradientCard title="Top 10 Produtos" description="Maiores previsões por SKU">
              <div className="space-y-3">
                {topProducts.map((item, index) => (
                  <div key={item.produto} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">SKU {item.produto}</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {item.quantidade.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </GradientCard>
          </div>
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por PDV ou Produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(week => (
                <Button
                  key={week}
                  variant={selectedWeek === week ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedWeek(selectedWeek === week ? null : week)}
                >
                  Sem {week}
                </Button>
              ))}
            </div>
          </div>

          <GradientCard title="Tabela de Previsões" description={`${filteredData.length} registros encontrados`}>
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semana</TableHead>
                    <TableHead>PDV</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.slice(0, 100).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline">{item.semana}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.pdv}</TableCell>
                      <TableCell className="font-medium">{item.produto}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {item.quantidade.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredData.length > 100 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Mostrando primeiros 100 resultados de {filteredData.length}
                </div>
              )}
            </div>
          </GradientCard>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <GradientCard 
        title="Instruções para Submissão" 
        description="Como submeter suas previsões no hackathon"
        gradient
      >
        <div className="text-white space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Formato CSV:</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Separador: ponto e vírgula (;)</li>
                <li>• Encoding: UTF-8</li>
                <li>• Colunas: semana;pdv;produto;quantidade</li>
                <li>• Exemplo: 1;1023;123;120</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Submissão:</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Até 5 submissões por participante</li>
                <li>• Melhor resultado no leaderboard</li>
                <li>• Avaliação por WMAPE (%)</li>
                <li>• Repositório GitHub obrigatório</li>
              </ul>
            </div>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}