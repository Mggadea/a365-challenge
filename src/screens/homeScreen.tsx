import { useState, useMemo } from "react";
import SearchBox from "../components/searchBox";
import ReservationList from "../components/reservationList";
import { useBookings } from "../hooks/useBookings";
import type { GetBookingsParams } from "../API/bookingService";

const PAGE_SIZE = 5;

function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const params = useMemo<GetBookingsParams>(() => {
    const baseParams: GetBookingsParams = {
      page,
      pageSize: PAGE_SIZE,
    };

    if (searchTerm.trim()) {
      const trimmedSearch = searchTerm.trim();
      // Improved heuristic: 
      // - If it contains numbers, it's likely a reservation code.
      // - Otherwise, treat it as a passenger name.
      // This prevents short names like "Ana" from being treated as reservation IDs.
      if (/\d/.test(trimmedSearch)) {
        baseParams.reserva = trimmedSearch;
      } else {
        baseParams.pasajero = trimmedSearch;
      }
    }

    return baseParams;
  }, [page, searchTerm]);

  const isSearchEnabled = searchTerm.trim().length > 0;
  const { data, isLoading, error } = useBookings(params, isSearchEnabled);

  const bookings = data?.resultados ?? [];
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto p-6">
      <h1 className="mb-6">Reservas</h1>
      <div className="mb-6 w-full">
        <SearchBox 
          placeholder="Buscar por pasajero o número de reserva..."
          onSearch={handleSearch}
        />
      </div>

      {!isSearchEnabled ? (
        <div className="text-center p-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 mt-4">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-slate-500 font-medium text-lg">
            Ingresa un nombre de pasajero o número de reserva para comenzar la búsqueda.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Ejemplo: "Ana" o "B789"
          </p>
        </div>
      ) : (
        <>
          <ReservationList 
            data={bookings} 
            loading={isLoading} 
            error={error instanceof Error ? error.message : null} 
          />
          
          {!isLoading && !error && bookings.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`py-2 px-4 rounded-md border border-slate-200 ${
                  page === 1 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-white text-slate-700 cursor-pointer'
                }`}
              >
                Anterior
              </button>
              <span className="text-slate-500">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`py-2 px-4 rounded-md border border-slate-200 ${
                  page === totalPages 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-white text-slate-700 cursor-pointer'
                }`}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomeScreen;
