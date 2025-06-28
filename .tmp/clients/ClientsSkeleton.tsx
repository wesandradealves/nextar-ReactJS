import React from 'react';

const ClientsSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-4 rounded-lg shadow-md bg-gray-200 animate-pulse flex flex-col gap-4"
        >
          <div className="w-full h-48 bg-gray-300 rounded-md" />
          <div className="h-6 w-3/4 bg-gray-300 rounded" />
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="h-5 w-16 bg-gray-300 rounded-full" />
            <div className="h-5 w-12 bg-gray-300 rounded-full" />
            <div className="h-5 w-20 bg-gray-300 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientsSkeleton;
