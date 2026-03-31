import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center">
      <div>
        <h1 className="text-2xl font-bold text-primary">ESG Accelo 360Hub</h1>
        <p className="text-sm text-neutral-500">
          Sustainability-driven insights and data management
        </p>
      </div>

      <div className="ml-auto flex items-center space-x-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <span className="material-icons absolute left-3 top-2 text-neutral-400">
            search
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 rounded-full"
        >
          <span className="material-icons">notifications</span>
          <span className="absolute top-1 right-1 w-4 h-4 bg-accent rounded-full text-white text-[10px] flex items-center justify-center font-medium">
            3
          </span>
        </Button>

        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
          <span className="material-icons">help_outline</span>
        </Button>
      </div>
    </header>
  );
}
