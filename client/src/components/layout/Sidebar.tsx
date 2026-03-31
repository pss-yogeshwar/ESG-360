import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { navigationItems, configurationItems } from "@/lib/constants";

export default function Sidebar() {
  const [location] = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <aside
      id="sidebar"
      className={`fixed top-0 left-0 z-20 w-64 h-full pt-16 flex ${
        isMobile ? "hidden" : "flex"
      } flex-shrink-0 flex-col transition-width duration-150 ease-in-out bg-white border-r border-gray-200`}
      aria-label="Sidebar"
    >
      <div className="relative flex-1 flex flex-col min-h-0 pt-0">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
              Main
            </div>
            
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 text-base ${
                  location === item.path
                    ? "text-gray-900 bg-neutral rounded-lg"
                    : "text-gray-500 rounded-lg hover:bg-gray-100"
                }`}
              >
                <i className={`${item.icon} text-lg mr-3 ${location === item.path ? 'text-primary' : 'text-gray-500'}`}></i>
                <span className="ml-1">{item.name}</span>
              </Link>
            ))}
            
            <div className="px-4 pt-6 pb-2 text-xs font-semibold text-gray-400 uppercase">
              Configuration
            </div>
            
            {configurationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 text-base ${
                  location === item.path
                    ? "text-gray-900 bg-neutral rounded-lg"
                    : "text-gray-500 rounded-lg hover:bg-gray-100"
                }`}
              >
                <i className={`${item.icon} text-lg mr-3 ${location === item.path ? 'text-primary' : 'text-gray-500'}`}></i>
                <span className="ml-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="px-4 py-3 bg-primary-light rounded-lg">
            <div className="flex items-center">
              <i className="ri-rocket-line text-lg text-white mr-3"></i>
              <div>
                <p className="text-sm font-medium text-white">ESG AI Assistant</p>
                <p className="text-xs text-neutral-light">Ask questions about your data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
