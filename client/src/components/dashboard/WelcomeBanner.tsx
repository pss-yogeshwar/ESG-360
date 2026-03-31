import { demoUser } from "@/lib/constants";

export default function WelcomeBanner() {
  return (
    <div className="p-6 mb-6 bg-gradient-to-r from-primary to-primary-light rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-white">Welcome to ESG Accelo 360Hub</h1>
          <p className="mt-1 text-neutral-light">Automate your GRI standards data capturing and ESG reporting process</p>
        </div>
        <div>
          <button className="bg-white hover:bg-neutral text-primary font-medium py-2 px-4 rounded-lg shadow-sm">
            <i className="ri-play-circle-line mr-1"></i> Quick Tour
          </button>
        </div>
      </div>
    </div>
  );
}
