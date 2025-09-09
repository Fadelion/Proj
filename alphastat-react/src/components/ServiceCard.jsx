import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-2xl font-bold text-gray-800">{service.title}</h3>
      <p className="mt-2 text-gray-600">
        {service.description}
      </p>
      <div className="mt-4">
        <p className="text-lg font-semibold text-gray-900">
          {service.prix_indicatif} €
          <span className="text-sm font-normal text-gray-500"> (prix indicatif)</span>
        </p>
      </div>
      <Link
        to={`/services/${service.id}`}
        className="mt-4 inline-block bg-primary-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Voir plus
      </Link>
    </div>
  );
};

export default ServiceCard;
