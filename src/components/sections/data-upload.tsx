import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { GradientCard } from "@/components/ui/gradient-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Database, Package, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataUploadProps {
  onDataLoaded: (data: any) => void;
}

export function DataUpload({ onDataLoaded }: DataUploadProps) {
  const [transactionsFile, setTransactionsFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleTransactionsUpload = (file: File) => {
    setTransactionsFile(file);
    toast({
      title: "Arquivo carregado",
      description: `${file.name} foi carregado com sucesso.`,
    });
  };

  const processData = async () => {
    if (!transactionsFile) return;

    setIsProcessing(true);
    
    try {
      // Simulate data processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData = {
        transactions: {
          rows: 125000,
          dateRange: "2022-01-01 a 2022-12-31",
          totalSales: 15420000
        },
        pdvs: {
          total: 14419,
          onPremise: 8450,
          offPremise: 5969
        },
        products: {
          total: 7092,
          categories: 12
        }
      };
      
      onDataLoaded(mockData);
      
      toast({
        title: "Dados processados",
        description: "Análise exploratória está pronta!",
      });
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Falha ao processar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Hackathon Forecast Big Data 2025
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sistema de análise preditiva para previsão de vendas no varejo
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <GradientCard 
          title="1. Dados de Transações" 
          description="Upload do arquivo principal com histórico de vendas 2022"
          className="relative"
        >
          <FileUpload 
            onFileSelect={handleTransactionsUpload}
            accept=".csv"
            className="border-0 p-0"
          >
            <div className="mt-4 text-xs text-muted-foreground">
              Formato: Data, PDV, Produto, Quantidade, Faturamento
            </div>
          </FileUpload>
          {transactionsFile && (
            <Badge variant="secondary" className="absolute top-4 right-4">
              <CheckCircle className="w-4 h-4 mr-1" />
              OK
            </Badge>
          )}
        </GradientCard>

        <GradientCard 
          title="2. Cadastro PDVs" 
          description="Pontos de venda já carregados"
          gradient
        >
          <div className="flex items-center justify-center space-y-4 text-white">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-80" />
              <div className="text-2xl font-bold">14,419</div>
              <div className="text-sm opacity-80">PDVs cadastrados</div>
            </div>
          </div>
          <Badge variant="secondary" className="absolute top-4 right-4">
            <CheckCircle className="w-4 h-4 mr-1" />
            OK
          </Badge>
        </GradientCard>

        <GradientCard 
          title="3. Cadastro Produtos" 
          description="Catálogo de produtos já carregado"
        >
          <div className="flex items-center justify-center space-y-4">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">7,092</div>
              <div className="text-sm text-muted-foreground">SKUs cadastrados</div>
            </div>
          </div>
          <Badge variant="secondary" className="absolute top-4 right-4">
            <CheckCircle className="w-4 h-4 mr-1" />
            OK
          </Badge>
        </GradientCard>
      </div>

      {transactionsFile && (
        <div className="text-center">
          <Button 
            onClick={processData}
            disabled={isProcessing}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3"
          >
            {isProcessing ? (
              <>
                <Database className="mr-2 h-5 w-5 animate-spin" />
                Processando dados...
              </>
            ) : (
              <>
                <Database className="mr-2 h-5 w-5" />
                Processar e Analisar Dados
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}