import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import AIAssistantButton from "./AIAssistantButton";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <div className="flex pt-16 h-screen overflow-hidden">
        <Sidebar />
        <div className="lg:ml-64 flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
          <Footer />
        </div>
      </div>
      <AIAssistantButton />
    </>
  );
}
