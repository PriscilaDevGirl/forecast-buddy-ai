import { useState } from "react";
import { DataUpload } from "@/components/sections/data-upload";
import { DataAnalysis } from "@/components/sections/data-analysis";
import { PredictiveModeling } from "@/components/sections/predictive-modeling";
import { PythonTesting } from "@/components/sections/python-testing";
import { ForecastResults } from "@/components/sections/forecast-results";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Database, Brain, Target, ArrowLeft, Code } from "lucide-react";

type AppStep = 'upload' | 'analysis' | 'modeling' | 'python-testing' | 'results';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('upload');
  const [processedData, setProcessedData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);

  const steps = [
    { id: 'upload', title: 'Upload de Dados', icon: Database },
    { id: 'analysis', title: 'Análise Exploratória', icon: Database },
    { id: 'modeling', title: 'Modelagem Preditiva', icon: Brain },
    { id: 'python-testing', title: 'Testes Python', icon: Code },
    { id: 'results', title: 'Resultados', icon: Target }
  ];

  const getStepIndex = (step: AppStep) => steps.findIndex(s => s.id === step);
  const currentStepIndex = getStepIndex(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleDataLoaded = (data: any) => {
    setProcessedData(data);
    setCurrentStep('analysis');
  };

  const handleStartModeling = () => {
    setCurrentStep('modeling');
  };

  const handleStartPythonTesting = () => {
    setCurrentStep('python-testing');
  };

  const handleForecastGenerated = (forecast: any[]) => {
    setForecastData(forecast);
    setCurrentStep('results');
  };

  const goBack = () => {
    const stepOrder: AppStep[] = ['upload', 'analysis', 'modeling', 'python-testing', 'results'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {currentStep !== 'upload' && (
                <Button variant="ghost" size="sm" onClick={goBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold">Forecast Analytics</h1>
                <p className="text-muted-foreground">Sistema de Análise Preditiva</p>
              </div>
            </div>
            <Badge variant="outline">
              Hackathon Big Data 2025
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                      ${isActive ? 'border-primary bg-primary text-primary-foreground' : ''}
                      ${isCompleted ? 'border-success bg-success text-success-foreground' : ''}
                      ${!isActive && !isCompleted ? 'border-border bg-background' : ''}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <div className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'upload' && (
          <DataUpload onDataLoaded={handleDataLoaded} />
        )}

        {currentStep === 'analysis' && processedData && (
          <DataAnalysis 
            data={processedData} 
            onStartModeling={handleStartModeling}
            onStartPythonTesting={handleStartPythonTesting}
          />
        )}

        {currentStep === 'modeling' && processedData && (
          <PredictiveModeling 
            data={processedData}
            onForecastGenerated={handleForecastGenerated}
          />
        )}

        {currentStep === 'python-testing' && processedData && (
          <PythonTesting 
            data={processedData}
            onForecastGenerated={handleForecastGenerated}
          />
        )}

        {currentStep === 'results' && forecastData.length > 0 && (
          <ForecastResults forecastData={forecastData} />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Forecast Analytics - Hackathon Big Data Challenge</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;