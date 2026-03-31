import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import DataIngestionComponent from "@/components/ingestion/DataIngestion";

export default function DataIngestion() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Microsoft Sustainability Manager Integration</CardTitle>
          <CardDescription>
            Ingest your ESG data directly to Microsoft Sustainability Manager using Microsoft Fabric
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataIngestionComponent />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>About Microsoft Sustainability Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What is Microsoft Sustainability Manager?</h3>
              <p className="text-gray-600">
                Microsoft Sustainability Manager is a comprehensive solution that helps organizations record, report, 
                and reduce their environmental impact. It provides a central system of record for environmental data 
                to help streamline carbon accounting.
              </p>
              <p className="text-gray-600 mt-2">
                The platform enables organizations to track emissions across their value chain, set and track progress 
                toward goals, and create accurate reports for disclosure.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Integration Benefits</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>Automated data flow from ESG Accelo 360Hub to Microsoft Sustainability Manager</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>Standardized data mapping between GRI standards and Microsoft's data model</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>Reduced manual data entry and improved data quality</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>Unified view of sustainability data across platforms</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How Microsoft Fabric Enables Integration</h3>
            <div className="p-5 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                  <i className="ri-database-2-line text-3xl text-primary mb-2"></i>
                  <h4 className="font-medium text-gray-800 mb-1 text-center">Data Collection</h4>
                  <p className="text-sm text-gray-600 text-center">
                    ESG Accelo 360Hub captures and standardizes your GRI data
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <i className="ri-exchange-line text-3xl text-primary mb-2"></i>
                  <h4 className="font-medium text-gray-800 mb-1 text-center">Microsoft Fabric</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Securely transforms and transfers data between systems
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <i className="ri-microsoft-line text-3xl text-primary mb-2"></i>
                  <h4 className="font-medium text-gray-800 mb-1 text-center">Sustainability Manager</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Data appears in Microsoft's platform for reporting and analysis
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <div className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
                  <i className="ri-shield-check-line mr-1"></i> Secure, authenticated API connections
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
