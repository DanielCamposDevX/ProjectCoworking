import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getVisiblePages = () => {
    const visiblePages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        variant={'secondary'}
        className="bg-white p-2"
      >
        <ChevronLeft />
      </Button>
      {visiblePages.map(page => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'secondary'}
          style={currentPage === page ? {} : { backgroundColor: 'white' }}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        variant={'secondary'}
        className="bg-white p-2"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
