import { Button, Group } from '@mantine/core';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage = 10, 
  totalItems = 0 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
      
      <Group gap="xs">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          leftSection={<FaChevronLeft size={12} />}
        >
          Previous
        </Button>
        
        {getVisiblePages().map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? "filled" : "outline"}
            size="sm"
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            color={page === currentPage ? "blue" : "gray"}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          rightSection={<FaChevronRight size={12} />}
        >
          Next
        </Button>
      </Group>
    </div>
  );
};

export default Pagination;