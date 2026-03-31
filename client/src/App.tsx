import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import DataTemplates from "@/pages/DataTemplates";
import AIAssistant from "@/pages/AIAssistant";
import AnomalyDetection from "@/pages/AnomalyDetection";
import DataIngestion from "@/pages/DataIngestion";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import UserManagement from "@/pages/UserManagement";
import MicrosoftIntegration from "@/pages/MicrosoftIntegration";
import Layout from "@/components/layout/Layout";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/templates" component={DataTemplates} />
        <Route path="/assistant" component={AIAssistant} />
        <Route path="/anomaly" component={AnomalyDetection} />
        <Route path="/ingestion" component={DataIngestion} />
        <Route path="/reports" component={Reports} />
        <Route path="/settings" component={Settings} />
        <Route path="/users" component={UserManagement} />
        <Route path="/integrations" component={MicrosoftIntegration} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
