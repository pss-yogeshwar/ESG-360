import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ChatInterface from "@/components/assistant/ChatInterface";

export default function AIAssistant() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered ESG Assistant</CardTitle>
          <CardDescription>
            Ask questions about your ESG data, GRI standards, or get help with sustainability reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChatInterface />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Query</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                <i className="ri-database-2-line text-primary text-xl"></i>
              </div>
              <div>
                <h3 className="text-md font-semibold">Query Your Data</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Ask questions about your ESG data in natural language. Get quick insights about metrics, trends, and performance.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <p className="italic">Example: "What's our water consumption trend over the last 3 quarters?"</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">GRI Guidance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-3">
                <i className="ri-file-list-3-line text-secondary text-xl"></i>
              </div>
              <div>
                <h3 className="text-md font-semibold">Standards Assistance</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Get guidance on GRI standards, reporting requirements, and best practices for sustainability disclosure.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <p className="italic">Example: "Explain the requirements for GRI 303 Water and Effluents reporting."</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Report Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mr-3">
                <i className="ri-lightbulb-line text-warning text-xl"></i>
              </div>
              <div>
                <h3 className="text-md font-semibold">Smart Recommendations</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Get intelligent recommendations to improve your sustainability performance based on your ESG data.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <p className="italic">Example: "What areas of our ESG performance need improvement?"</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-chat-3-line text-primary text-xl"></i>
              </div>
              <h3 className="text-md font-semibold mb-2">Ask</h3>
              <p className="text-sm text-gray-600">
                Type your question about ESG data or GRI standards in natural language
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-robot-line text-secondary text-xl"></i>
              </div>
              <h3 className="text-md font-semibold mb-2">AI Processing</h3>
              <p className="text-sm text-gray-600">
                Our AI analyzes your question and searches your ESG database
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-file-search-line text-warning text-xl"></i>
              </div>
              <h3 className="text-md font-semibold mb-2">Data Retrieval</h3>
              <p className="text-sm text-gray-600">
                Relevant information is retrieved from your ESG data and GRI standards
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-message-2-line text-primary-dark text-xl"></i>
              </div>
              <h3 className="text-md font-semibold mb-2">Clear Answer</h3>
              <p className="text-sm text-gray-600">
                Get a concise, accurate response based on your specific ESG data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
