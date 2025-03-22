import type { Page } from "../types/canvas";

interface PageNavigationProps {
  pages: Page[];
  currentPage: number;
  onSelectPage: (pageId: number) => void;
  onEditPage: (pageId: number) => void;
  onDeletePage: (pageId: number) => void;
}

export const PageNavigation = ({
  pages,
  currentPage,
  onSelectPage,
  onEditPage,
  onDeletePage,
}: PageNavigationProps) => {
  return (
    <div className="flex gap-2 w-full bg-amber-700 p-2 overflow-x-auto">
      {pages.map((page) => (
        <div key={page.id} className="flex items-center">
          <button
            className={`px-4 py-1 rounded ${
              currentPage === page.id
                ? "bg-white text-amber-900"
                : "bg-amber-800 text-white"
            }`}
            onClick={() => onSelectPage(page.id)}
          >
            {page.name}
          </button>
          <div className="flex ml-1">
            <button
              className="px-2 bg-blue-600 text-white rounded-l"
              onClick={() => onEditPage(page.id)}
            >
              ✏️
            </button>
            {pages.length > 1 && (
              <button
                className="px-2 bg-red-600 text-white rounded-r"
                onClick={() => onDeletePage(page.id)}
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
