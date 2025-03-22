import { useState } from "react";
import type { Page, Element } from "../types/canvas";

export function usePages(
  setElements: React.Dispatch<React.SetStateAction<Element[]>>
) {
  const [pages, setPages] = useState<Page[]>([{ id: 1, name: "Page 1" }]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [pageNameInput, setPageNameInput] = useState<string>("");

  // Add a new page
  const addPage = () => {
    const newId = pages.length + 1;
    setPages((prev) => [...prev, { id: newId, name: `Page ${newId}` }]);
  };

  // Select a page for editing
  const handleSelectPage = (pageId: number) => {
    setSelectedPage(pageId);
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      setPageNameInput(page.name);
    }
  };

  // Update page name
  const updatePageName = () => {
    if (selectedPage && pageNameInput.trim()) {
      setPages((prev) =>
        prev.map((page) =>
          page.id === selectedPage ? { ...page, name: pageNameInput } : page
        )
      );
      setSelectedPage(null);
    }
  };

  // Delete a page
  const deletePage = (pageId: number) => {
    if (pages.length > 1) {
      setPages((prev) => prev.filter((page) => page.id !== pageId));
      setElements((prev) => prev.filter((el) => el.pageId !== pageId));

      // If current page is deleted, select the first available page
      if (currentPage === pageId) {
        const firstAvailablePage = pages.find((page) => page.id !== pageId);
        if (firstAvailablePage) {
          setCurrentPage(firstAvailablePage.id);
        }
      }
    }
  };

  // Cancel page editing
  const cancelPageEdit = () => setSelectedPage(null);

  return {
    pages,
    currentPage,
    selectedPage,
    pageNameInput,
    setCurrentPage,
    addPage,
    handleSelectPage,
    updatePageName,
    deletePage,
    cancelPageEdit,
    setPageNameInput,
  };
}
