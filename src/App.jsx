import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "./components/Spinner";


const STATUSES = ["available", "pending", "sold"];

const STATUS_STYLES = {
  available: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  sold: 'bg-gray-100 text-gray-800'
};

const App = () => {
  const [pets, setPets] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStatusChange = (status) => {
    if (selectedStatuses.includes(status)) {
      const newStatuses = selectedStatuses.filter(s => s !== status);
      setSelectedStatuses(newStatuses);
      // Clear pets if all statuses are deselected
      if (newStatuses.length === 0) {
        setPets([]);
      }
    } else if (selectedStatuses.length < 2) {
      setSelectedStatuses(prev => [...prev, status]);
    }
  };

  useEffect(() => {
    // Return early if no statuses are selected
    if (selectedStatuses.length === 0) {
      setPets([]);
      return;
    }

    const controller = new AbortController();

    const fetchPets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://petstore.swagger.io/v2/pet/findByStatus?status=${selectedStatuses.join(",")}`,
          { signal: controller.signal }
        );

        const validPets = Array.isArray(response.data)
          ? response.data
            .filter(pet => pet?.id != null)
            .map(pet => ({
              id: pet.id,
              name: pet.name || "No name",
              status: pet.status || "unknown",
            }))
          : [];

        setPets(validPets);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err.response?.data?.message || "Failed to fetch pets");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
    return () => controller.abort();
  }, [selectedStatuses]);

  return (
    <div className="min-h-screen bg-gray-700 py-8">
      <div className="max-w-2xl mx-auto bg-gray-500 rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Pet Store</h2>

        <div className="bg-gray-400 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">
              Filter by status (max 2):
            </h3>
            <button
              onClick={() => setSelectedStatuses([])}
              className="text-sm text-blue-600  rounded-full hover:text-blue-800 cursor-pointer"
            >
              Reset filters
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {STATUSES.map((status) => (
              <label
                key={status}
                className={`flex items-center cursor-pointer group ${!selectedStatuses.includes(status) && selectedStatuses.length >= 2
                  ? 'opacity-50'
                  : ''
                  }`}
              >
                <input
                  type="checkbox"
                  value={status}
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 capitalize group-hover:text-blue-600 transition-colors">
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-2">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div
                key={pet.id}
                className="flex items-center justify-between p-3 hover:bg-gray-400 rounded-lg transition-colors"
              >
                <span className="text-gray-800">
                  {pet.name}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[pet.status] || STATUS_STYLES.sold}`}>
                  {pet.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-900 text-center py-4">
              {selectedStatuses.length === 0 ? "Select a status to filter pets." : "No pets found."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
