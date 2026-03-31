import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { demoUser } from "@/lib/constants";
import { 
  environmentalStandards, 
  socialStandards, 
  governanceStandards 
} from "@/lib/constants";

interface GriStandard {
  id: number;
  code: string;
  name: string;
  category: string;
  description: string;
  indicator?: string;
  units?: string;
  threshold?: string;
}

export default function GRITemplateGenerator() {
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [selectedStandards, setSelectedStandards] = useState<number[]>([]);
  const [activeStandard, setActiveStandard] = useState<number | null>(null);
  const [indicatorSettings, setIndicatorSettings] = useState<{[key: number]: {
    indicator: string;
    units: string;
    threshold: string;
  }}>({});
  
  // Fetch GRI standards from API
  const { data: griStandards, isLoading, error } = useQuery({
    queryKey: ['/api/gri-standards'],
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: {
      name: string;
      description: string;
      userId: number;
      standards: number[];
    }) => {
      const response = await apiRequest("POST", "/api/templates", templateData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template created successfully",
      });
      // Reset form
      setTemplateName("");
      setTemplateDescription("");
      setSelectedStandards([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create template: " + error,
        variant: "destructive",
      });
    },
  });

  const handleStandardToggle = (standardId: number) => {
    setSelectedStandards((prev) => {
      if (prev.includes(standardId)) {
        return prev.filter((id) => id !== standardId);
      } else {
        // Initialize indicator settings for this standard if not already set
        if (!indicatorSettings[standardId]) {
          setIndicatorSettings(prev => ({
            ...prev,
            [standardId]: {
              indicator: "",
              units: "",
              threshold: ""
            }
          }));
        }
        return [...prev, standardId];
      }
    });
  };
  
  const handleIndicatorChange = (standardId: number, field: 'indicator' | 'units' | 'threshold', value: string) => {
    setIndicatorSettings(prev => ({
      ...prev,
      [standardId]: {
        ...prev[standardId],
        [field]: value
      }
    }));
  };
  
  const openIndicatorSettings = (standardId: number) => {
    setActiveStandard(standardId);
    
    // Initialize settings for this standard if not already set
    if (!indicatorSettings[standardId]) {
      setIndicatorSettings(prev => ({
        ...prev,
        [standardId]: {
          indicator: "",
          units: "",
          threshold: ""
        }
      }));
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a template name",
        variant: "destructive",
      });
      return;
    }

    if (selectedStandards.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one GRI standard",
        variant: "destructive",
      });
      return;
    }

    createTemplateMutation.mutate({
      name: templateName,
      description: templateDescription,
      userId: demoUser.id,
      standards: selectedStandards,
    });
  };

  const handleGenerateTemplate = () => {
    // This would typically generate a downloadable template
    // For MVP, we'll just save the template
    handleSaveTemplate();
  };

  // Group standards by category for the UI
  const getStandardsByCategory = (category: string): GriStandard[] => {
    if (!griStandards) return [];
    return griStandards.filter((standard: GriStandard) => standard.category === category);
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading GRI standards...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading GRI standards</div>;
  }

  const environmentalStds = getStandardsByCategory("environmental");
  const socialStds = getStandardsByCategory("social");
  const governanceStds = getStandardsByCategory("governance");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <div className="mb-4">
          <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 mb-1">
            Template Name
          </label>
          <input
            id="template-name"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="template-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="template-description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter template description"
            rows={2}
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
          ></textarea>
        </div>
        <p className="text-gray-600 mt-4">Select GRI standards to include in your data capture template:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard Categories */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Standard Categories</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <input id="gri-universal" type="checkbox" className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" />
              <label htmlFor="gri-universal" className="ml-2 text-sm text-gray-700">GRI Universal Standards (GRI 1, 2, 3)</label>
            </div>
            <div className="flex items-center">
              <input id="gri-sector" type="checkbox" className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" />
              <label htmlFor="gri-sector" className="ml-2 text-sm text-gray-700">GRI Sector Standards</label>
            </div>
            <div className="flex items-center">
              <input id="gri-topic" type="checkbox" className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" />
              <label htmlFor="gri-topic" className="ml-2 text-sm text-gray-700">GRI Topic Standards (200, 300, 400)</label>
            </div>
          </div>

          <h4 className="font-medium text-gray-700 mt-6 mb-3">Environmental Standards</h4>
          <div className="space-y-3">
            {environmentalStds.map((standard) => (
              <div className="flex items-center" key={standard.id}>
                <input
                  id={`gri-${standard.id}`}
                  type="checkbox"
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={selectedStandards.includes(standard.id)}
                  onChange={() => handleStandardToggle(standard.id)}
                />
                <label htmlFor={`gri-${standard.id}`} className="ml-2 text-sm text-gray-700">
                  {standard.code}: {standard.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Social & Governance Standards */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Social Standards</h4>
          <div className="space-y-3">
            {socialStds.map((standard) => (
              <div className="flex items-center" key={standard.id}>
                <input
                  id={`gri-${standard.id}`}
                  type="checkbox"
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={selectedStandards.includes(standard.id)}
                  onChange={() => handleStandardToggle(standard.id)}
                />
                <label htmlFor={`gri-${standard.id}`} className="ml-2 text-sm text-gray-700">
                  {standard.code}: {standard.name}
                </label>
              </div>
            ))}
          </div>

          <h4 className="font-medium text-gray-700 mt-6 mb-3">Governance Standards</h4>
          <div className="space-y-3">
            {governanceStds.map((standard) => (
              <div className="flex items-center" key={standard.id}>
                <input
                  id={`gri-${standard.id}`}
                  type="checkbox"
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={selectedStandards.includes(standard.id)}
                  onChange={() => handleStandardToggle(standard.id)}
                />
                <label htmlFor={`gri-${standard.id}`} className="ml-2 text-sm text-gray-700">
                  {standard.code}: {standard.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GRI Indicator Configuration Section */}
      {selectedStandards.length > 0 && (
        <div className="mt-8 mb-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">GRI Indicator Configuration</h3>
          <p className="text-sm text-gray-600 mb-4">
            Configure indicators for the selected GRI standards to set thresholds and measurement units for data capture.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedStandards.map(standardId => {
              const standard = griStandards?.find((s: GriStandard) => s.id === standardId);
              if (!standard) return null;
              
              const settings = indicatorSettings[standardId] || { indicator: "", units: "", threshold: "" };
              
              return (
                <div key={standard.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                  <div className="font-medium text-gray-800 mb-2">{standard.code}</div>
                  <div className="text-sm text-gray-700 mb-3 truncate">{standard.name}</div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        GRI Indicator <span className="text-amber-600">*</span>
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="e.g., GRI 302-1 Energy consumption"
                        value={settings.indicator}
                        onChange={(e) => handleIndicatorChange(standardId, 'indicator', e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Specific GRI indicator code and name</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Measurement Units <span className="text-amber-600">*</span>
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="e.g., kWh, tons CO2e, %"
                          value={settings.units}
                          onChange={(e) => handleIndicatorChange(standardId, 'units', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Threshold Value
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="e.g., 100000"
                          value={settings.threshold}
                          onChange={(e) => handleIndicatorChange(standardId, 'threshold', e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">For anomaly detection</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {selectedStandards.length === 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
          <div className="flex items-center">
            <i className="ri-alert-line mr-2 text-lg"></i>
            <strong>Please select at least one GRI standard</strong>
          </div>
          <p className="mt-1 ml-6">You must select one or more standards to generate a template.</p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <div>
          <button
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg mr-3"
            onClick={handleSaveTemplate}
            disabled={createTemplateMutation.isPending || selectedStandards.length === 0}
          >
            Save Template
          </button>
          <button
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg"
            onClick={handleGenerateTemplate}
            disabled={createTemplateMutation.isPending || selectedStandards.length === 0}
          >
            Generate Template
          </button>
        </div>
        <div className="text-sm text-gray-500">
          <span className={`font-medium ${selectedStandards.length === 0 ? 'text-amber-600' : 'text-primary'}`}>
            {selectedStandards.length}
          </span> standards selected
        </div>
      </div>
    </div>
  );
}
