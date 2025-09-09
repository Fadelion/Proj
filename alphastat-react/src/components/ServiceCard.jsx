import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 m-4 hover:shadow-xl transition">
      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
      <p className="text-gray-600 mb-2">{service.description}</p>
      <p className="text-blue-600 font-semibold mb-4">
        Prix indicatif : {service.prix_indicatif} €
      </p>
      <Link
        to={`/services/${service.id}`}
        className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Voir plus
      </Link>
    </div>
  );
};

export default ServiceCard;
