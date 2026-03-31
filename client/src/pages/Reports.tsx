import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportGenerator from "@/components/reports/ReportGenerator";

interface Report {
  id: number;
  name: string;
  description: string;
  templateId: number;
  userId: number;
  createdAt: string;
  reportData: any;
}

export default function Reports() {
  // Fetch reports
  const { data: reports, isLoading } = useQuery({
    queryKey: ['/api/reports'],
  });

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ESG Reports</CardTitle>
          <CardDescription>
            Generate and view comprehensive ESG performance reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generate">
            <TabsList className="mb-4">
              <TabsTrigger value="generate">Generate Report</TabsTrigger>
              <TabsTrigger value="saved">Saved Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate">
              <ReportGenerator />
            </TabsContent>
            
            <TabsContent value="saved">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading reports...</p>
                </div>
              ) : reports && reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report: Report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{report.name}</h3>
                          <p className="text-sm text-gray-500">
                            Generated on: {formatDate(report.createdAt)}
                          </p>
                          {report.description && (
                            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                          )}
                        </div>
                        <div className="flex mt-4 md:mt-0">
                          <button className="bg-primary hover:bg-primary-dark text-white font-medium py-1 px-3 rounded-lg text-sm flex items-center">
                            <i className="ri-eye-line mr-1"></i> View Report
                          </button>
                          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-1 px-3 rounded-lg ml-2 text-sm flex items-center">
                            <i className="ri-download-line mr-1"></i> Export
                          </button>
                        </div>
                      </div>
                      
                      {report.reportData && report.reportData.overview && (
                        <div className="mt-4 grid grid-cols-3 gap-3">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-500">Environmental</span>
                            <div className="text-xl font-semibold text-primary">
                              {report.reportData.overview.environmentalScore}%
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-500">Social</span>
                            <div className="text-xl font-semibold text-primary">
                              {report.reportData.overview.socialScore}%
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-500">Governance</span>
                            <div className="text-xl font-semibold text-primary">
                              {report.reportData.overview.governanceScore}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <i className="ri-bar-chart-box-line text-primary text-4xl"></i>
                  <p className="text-gray-700 mt-2">No reports found</p>
                  <p className="text-gray-500 text-sm mt-1">Generate your first report to get started</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>About ESG Reporting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">The Importance of ESG Reporting</h3>
              <p className="text-gray-600">
                ESG reporting helps organizations communicate their environmental, social, and governance 
                performance to stakeholders, including investors, customers, employees, and regulators.
              </p>
              <p className="text-gray-600 mt-2">
                High-quality, transparent ESG reporting has become essential for meeting regulatory 
                requirements, attracting investment, and demonstrating commitment to sustainability.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Our Reporting Approach</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>GRI Standards alignment for credible, consistent reporting</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>AI-powered data analysis for meaningful insights</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>Interactive visualizations for better understanding</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>Export options for stakeholder communication</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
