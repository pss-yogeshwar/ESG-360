import { useState } from "react";
import Logo from "@/assets/logo";
import { demoUser } from "@/lib/constants";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.toggle("hidden");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button 
              id="sidebar-toggle" 
              className="p-2 rounded-md lg:hidden"
              onClick={toggleSidebar}
            >
              <i className="ri-menu-line text-gray-600 text-2xl"></i>
            </button>
            <a href="/" className="flex ml-2 md:mr-24">
              <Logo className="h-12 mr-3" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-primary">
                ESG Accelo 360Hub
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center">
                <i className="ri-question-line mr-1"></i> Help
              </button>
            </div>
            <div className="flex items-center">
              <div className="mr-3">
                <span className="inline-block relative">
                  <i className="ri-notification-3-line text-xl text-gray-600"></i>
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-error rounded-full">
                    3
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                  alt="User"
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">{demoUser.fullName}</p>
                  <p className="text-xs text-gray-500">{demoUser.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
