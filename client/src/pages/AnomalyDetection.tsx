import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import AnomalyDetectionEngine from "@/components/anomaly/AnomalyDetectionEngine";

export default function AnomalyDetection() {
  return (
    <div className="space-y-6">
      <AnomalyDetectionEngine />
      
      <Card>
        <CardHeader>
          <CardTitle>Understanding Anomaly Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">What Are Data Anomalies?</h3>
                <p className="text-gray-600">
                  In ESG reporting, anomalies are unexpected patterns or outliers in your sustainability data that 
                  could indicate reporting errors, measurement issues, or genuine environmental or social events.
                </p>
                <p className="text-gray-600 mt-2">
                  Common examples include sudden spikes in energy consumption, unusual water usage patterns, or
                  statistical outliers in emissions data.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Benefits of Detection</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                    <span>Improved data quality and reporting accuracy</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                    <span>Early detection of potential sustainability issues</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                    <span>Reduced compliance risks from incorrect disclosures</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                    <span>Time savings through automated data validation</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How Our AI Detection Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h4 className="font-medium text-gray-700 mb-1">Data Collection</h4>
                  <p className="text-sm text-gray-600">
                    Scans your ESG data points across templates and time periods
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-gray-700 mb-1">Pattern Analysis</h4>
                  <p className="text-sm text-gray-600">
                    AI analyzes patterns, trends, and statistical distributions
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-gray-700 mb-1">Anomaly Flagging</h4>
                  <p className="text-sm text-gray-600">
                    Identifies and flags outliers for human review
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <h4 className="font-medium text-gray-700 mb-1">Resolution</h4>
                  <p className="text-sm text-gray-600">
                    Enables review, correction, and tracking of anomalies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
