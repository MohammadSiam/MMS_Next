import { useRouter } from "next/navigation";
import React from "react";

interface PopupProps {
  setShowPopup: (value: boolean) => void;
}
const Popup: React.FC<PopupProps> = ({ setShowPopup }) => {
  const router = useRouter();
  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-xs">
          <p className="mb-4 text-lg font-semibold">Wait for admin approval</p>
          <button
            onClick={() => {
              setShowPopup(false);
              router.push("/meetingList");
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
