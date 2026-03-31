import Logo from "@/assets/logo";

export default function Footer() {
  return (
    <footer className="bg-white p-6 border-t border-gray-200">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <Logo className="h-8 mr-3" />
        </div>
        <div className="text-center md:text-right">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} SOFTECH360. ESG Accelo 360Hub. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">Sustainability matters</p>
        </div>
      </div>
    </footer>
  );
}
