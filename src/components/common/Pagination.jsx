// Pagination.jsx
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const handlePageChange = (page) => {
    if (page === '...') return;
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    let pages = [];

    // Handle large datasets with ellipsis
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    return pages.map((page, index) => (
      <button
        key={index}
        onClick={() => handlePageChange(page)}
        disabled={page === '...'}
        className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ease-in-out ${
          page === currentPage
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'
        } ${page === '...' ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="mt-6 flex justify-center items-center space-x-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center bg-gray-200 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md text-gray-700 disabled:opacity-50"
      >
        <FaChevronLeft />
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center bg-gray-200 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md text-gray-700 disabled:opacity-50"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
