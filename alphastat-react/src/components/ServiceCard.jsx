import React from 'react';
import { Link } from 'react-router-dom';

// A simple SVG icon for decoration
const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ServiceCard = ({ service }) => {
  // Truncate description to a certain length to avoid overly long cards
  const truncatedDescription = service.description.length > 100
    ? service.description.substring(0, 100) + '...'
    : service.description;

  return (
    <div className="flex flex-col bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-3">
          <BriefcaseIcon />
          <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4 min-h-[60px]">
          {truncatedDescription}
        </p>
        <p className="text-xl font-bold text-gray-800">
          {service.prix_indicatif} €
          <span className="text-sm font-normal text-gray-500"> (prix indicatif)</span>
        </p>
      </div>
      <div className="bg-slate-50 px-6 py-4">
        <Link
          to={`/services/${service.id}`}
          className="w-full text-center inline-block rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Voir les détails et demander un devis
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
