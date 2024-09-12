import { useEffect, useState } from "react";
import { axiosPrivate } from "@/api/axios";
import { Watch } from "react-loader-spinner";

export const Dash = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllNotes = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/all-notes");
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  const approvedNotes = notes.filter((note) => note.approved === 1);
  const unapprovedNotes = notes.filter((note) => note.approved === 0);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-100 p-8">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Watch height="80" width="80" color="blue" ariaLabel="loading" />
        </div>
      ) : (
        <div className="mx-auto">
          {/* Total Notes Count */}
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 flex justify-between items-center mb-4">
            <div className="bg-white rounded-[10px] p-2">
              <h2 className="text-3xl font-semibold text-center">
                Total Notes Submitted: {notes.length}
              </h2>
            </div>
            <div className="bg-white rounded-[10px] p-2">
              <h2 className="text-3xl font-semibold text-center">
                Approved Notes: {approvedNotes.length}
              </h2>
            </div>
            <div className="bg-white rounded-[10px] p-2">
              <h2 className="text-3xl font-semibold text-center">
                Unapproved Notes: {unapprovedNotes.length}
              </h2>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Approved Notes */}
            <div className="relative bg-white rounded-3xl shadow-xl p-8 w-full lg:w-1/2 hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-100 rounded-3xl opacity-70"></div>

              {/* Number of Approved Notes */}
              <h2 className="relative text-2xl font-semibold text-green-600 mb-2 z-10">
                Approved Notes{" "}
                <span className="text-gray-600">({approvedNotes.length})</span>
              </h2>

              <p className="relative text-gray-500 text-sm mb-6 z-10">
                Showing the latest 3 approved notes
              </p>

              {approvedNotes.length > 0 ? (
                approvedNotes.slice(-3).map((note, index) => (
                  <div
                    key={index}
                    className="relative pb-6 mb-6 border-b border-gray-200 last:border-b-0 z-10"
                  >
                    <p className="text-lg font-medium text-gray-800">
                      <span className="font-bold">User:</span>{" "}
                      {note.user.firstname} {note.user.lastname}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Week:</span> {note.week}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Subject:</span>{" "}
                      {note.subject}
                    </p>
                  </div>
                ))
              ) : (
                <p className="relative text-gray-500 text-lg z-10">
                  No approved notes available.
                </p>
              )}
            </div>

            {/* Unapproved Notes */}
            <div className="relative bg-white rounded-3xl shadow-xl p-8 w-full lg:w-1/2 hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-100 rounded-3xl opacity-70"></div>

              {/* Number of Pending Notes */}
              <h2 className="relative text-2xl font-semibold text-red-600 mb-2 z-10">
                Pending Notes{" "}
                <span className="text-gray-600">
                  ({unapprovedNotes.length})
                </span>
              </h2>

              <p className="relative text-gray-500 text-sm mb-6 z-10">
                Showing the latest 3 pending notes
              </p>

              {unapprovedNotes.length > 0 ? (
                unapprovedNotes.slice(-3).map((note, index) => (
                  <div
                    key={index}
                    className="relative pb-6 mb-6 border-b border-gray-200 last:border-b-0 z-10"
                  >
                    <p className="text-lg font-medium text-gray-800">
                      <span className="font-bold">User:</span>{" "}
                      {note.user.firstname} {note.user.lastname}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Week:</span> {note.week}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Subject:</span>{" "}
                      {note.subject}
                    </p>
                  </div>
                ))
              ) : (
                <p className="relative text-gray-500 text-lg z-10">
                  No pending notes available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
