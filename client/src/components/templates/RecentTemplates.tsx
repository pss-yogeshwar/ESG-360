import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  standard: string;
  created: string;
  status: "ready" | "updating" | "processing";
}

export default function RecentTemplates() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "GRI_305_Emissions_Template.xlsx",
      standard: "GRI 305: Emissions",
      created: "Today, 10:32 AM",
      status: "ready",
    },
    {
      id: "2",
      name: "GRI_302_Energy_Template.xlsx",
      standard: "GRI 302: Energy",
      created: "Yesterday, 3:15 PM",
      status: "ready",
    },
    {
      id: "3",
      name: "GRI_403_OHS_Template.xlsx",
      standard: "GRI 403: Occupational Health and Safety",
      created: "Jul 15, 2023",
      status: "updating",
    },
  ]);

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast({
      title: "Template Deleted",
      description: "The template has been removed from your list.",
    });
  };

  const handleDownload = (id: string) => {
    toast({
      title: "Download Started",
      description: "Your template is being downloaded.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Ready</Badge>;
      case "updating":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Updating</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.standard.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex-row flex justify-between items-center pb-2">
        <CardTitle className="text-xl font-medium text-neutral-800">
          Recent Data Templates
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search templates..."
              className="pl-9 pr-4 py-1.5 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="material-icons absolute left-2 top-1.5 text-neutral-400 text-sm">
              search
            </span>
          </div>
          <Button variant="ghost" size="icon" className="p-1.5">
            <span className="material-icons text-neutral-500">filter_list</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Template Name
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  GRI Standard
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-neutral-50">
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="material-icons text-neutral-400 mr-2 text-sm">
                        description
                      </span>
                      <span className="text-sm font-medium text-neutral-900">
                        {template.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-neutral-700">
                    {template.standard}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-neutral-700">
                    {template.created}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {getStatusBadge(template.status)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-neutral-700">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-primary hover:text-primary-dark" 
                        title="Download"
                        onClick={() => handleDownload(template.id)}
                      >
                        <span className="material-icons text-sm">file_download</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-neutral-500 hover:text-neutral-700" 
                        title="Edit"
                      >
                        <span className="material-icons text-sm">edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-neutral-500 hover:text-neutral-700" 
                        title="Delete"
                        onClick={() => handleDelete(template.id)}
                      >
                        <span className="material-icons text-sm">delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-neutral-500">
            Showing {filteredTemplates.length} of {templates.length} templates
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 text-sm"
            >
              Previous
            </Button>
            <Button
              variant="default"
              size="sm"
              className="px-3 py-1 text-sm bg-primary"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 text-sm"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
