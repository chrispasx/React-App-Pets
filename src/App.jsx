import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "./components/Spinner";


const STATUSES = ["available", "pending", "sold"];

const STATUS_STYLES = {
  available: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  pending: 'bg-amber-100 text-amber-800 border border-amber-200',
  sold: 'bg-slate-100 text-slate-800 border border-slate-200'
};

const App = () => {
  const [pets, setPets] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStatusChange = (status) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else if (prev.length < 3) {
        return [...prev, status];
      }
      return prev;
    });
  };

  useEffect(() => {
    if (selectedStatuses.length === 0) {
      setPets([]); // Καθαρισμός pets αν δεν υπάρχουν επιλεγμένα φίλτρα
      return;
    }

    const controller = new AbortController();

    const fetchPets = async () => {
      setLoading(true);
      setError(null);
      setPets([]); // Καθαρισμός παλιών δεδομένων πριν το νέο request για να μην εχουμε προβλημα στο UI
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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-4xl font-bold text-slate-800 mb-8 text-center">
          Pet Store
        </h2>

        <div className="bg-slate-50 rounded-xl p-6 mb-8 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-700 text-lg">
              Filter by status
            </h3>
            <button
              onClick={() => {
                setSelectedStatuses([])
                setPets([])
              }}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 
                         transition-colors duration-200 cursor-pointer"
            >
              Reset filters
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {STATUSES.map((status) => (
              <label
                key={status}
                className={`flex items-center p-2 rounded-lg cursor-pointer
                           transition-all duration-200 hover:bg-slate-100
                           ${!selectedStatuses.includes(status) && selectedStatuses.length >= 3
                    ? 'opacity-40'
                    : ''
                  }`}
              >
                <input
                  type="checkbox"
                  value={status}
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 
                           focus:ring-blue-500 focus:ring-offset-2"
                />
                <span className="ml-3 text-slate-700 capitalize font-medium">
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div
                key={pet.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 
                         rounded-xl transition-colors duration-200 border border-slate-100"
              >
                <span className="text-slate-700 font-medium">
                  {pet.name}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium 
                              ${STATUS_STYLES[pet.status] || STATUS_STYLES.sold}`}>
                  {pet.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-600 text-center py-8 font-medium">
              {selectedStatuses.length === 0
                ? "Select one or more filters to see our pets."
                : "No pets found."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
