interface PageEditDialogProps {
  isOpen: boolean;
  pageNameInput: string;
  onClose: () => void;
  onSave: () => void;
  onInputChange: (value: string) => void;
}

export const PageEditDialog = ({
  isOpen,
  pageNameInput,
  onClose,
  onSave,
  onInputChange,
}: PageEditDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-4 rounded-lg">
        <h3 className="mb-2">Edit Page Name</h3>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          value={pageNameInput}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
