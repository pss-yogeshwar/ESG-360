import { Link } from "wouter";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  iconBgColor: string;
  buttonText: string;
  linkTo: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
  iconBgColor,
  buttonText,
  linkTo,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mb-4`}>
          <i className={`${icon} text-xl`}></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link href={linkTo}>
          <button className="mt-2 text-primary hover:text-primary-dark font-medium flex items-center">
            {buttonText} <i className="ri-arrow-right-line ml-1"></i>
          </button>
        </Link>
      </div>
    </div>
  );
}
