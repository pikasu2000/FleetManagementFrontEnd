// components/ui/DeleteCard.jsx
import React from "react";

const DeleteCard = ({ vehicle, onCancel, onConfirm }) => {
  return (
    <div className="group select-none w-[300px] flex flex-col p-4 relative items-center justify-center bg-white border border-gray-200 shadow-lg rounded-2xl">
      <div>
        <div className="text-center p-3 flex-auto justify-center">
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            className="group-hover:animate-bounce w-12 h-12 flex items-center text-red-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              fillRule="evenodd"
            />
          </svg>
          <h2 className="text-xl font-bold py-4 text-gray-800">
            Are you sure?
          </h2>
          <p className="font-medium text-sm text-gray-600 px-2">
            Do you really want to delete{" "}
            <span className="font-semibold">
              {vehicle?.make} {vehicle?.model}
            </span>
            ? This process cannot be undone.
          </p>
        </div>
        <div className="p-2 mt-4 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-sm shadow-sm font-medium border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition ease-in duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium border-2 border-red-500 text-white bg-red-500 rounded-full hover:bg-transparent hover:text-red-500 transition ease-in duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCard;
