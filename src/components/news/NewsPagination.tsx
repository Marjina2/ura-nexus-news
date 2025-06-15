
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
}

const NewsPagination: React.FC<NewsPaginationProps> = ({
  currentPage,
  totalPages,
  hasMore,
  onPreviousPage,
  onNextPage,
  onGoToPage
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="border-ura-green/40 hover:border-ura-green text-ura-white disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>

      <div className="flex gap-1">
        {[...Array(Math.min(5, totalPages))].map((_, i) => {
          const pageNumber = Math.max(1, currentPage - 2) + i;
          if (pageNumber > totalPages) return null;
          return (
            <Button
              key={pageNumber}
              onClick={() => onGoToPage(pageNumber)}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="sm"
              className={currentPage === pageNumber 
                ? "bg-ura-green text-ura-black" 
                : "border-ura-green/40 hover:border-ura-green text-ura-white"
              }
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      <Button
        onClick={onNextPage}
        disabled={!hasMore}
        variant="outline"
        size="sm"
        className="border-ura-green/40 hover:border-ura-green text-ura-white disabled:opacity-50"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default NewsPagination;
