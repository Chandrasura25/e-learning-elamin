import { useEffect, useState } from "react";
import { axiosPrivate } from "@/api/axios";
import { Watch } from "react-loader-spinner";
import style from "@/styles/box.module.css";
import firstBg from "@/assets/anime.gif";
import secBg from "@/assets/write.svg"; 
import thirdBg from "@/assets/book.gif";

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
    <div className="min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Watch height="80" width="80" color="blue" ariaLabel="loading" />
        </div>
      ) : (
        <div className="mx-auto">
          {/* Total Notes Count */}
          <div className={`${style.container} text-white`}>
            <div className={`relative ${style.box} flex-1 p-3`}>
              <div className="absolute h-[80px] w-[80px] rounded-full bg-white -left-4 -top-4">
                <img src={firstBg} alt="" />
              </div>
              <div className="flex flex-col justify-end items-end">
                <h1 className="text-heading1-semibold">
                  {unapprovedNotes.length}
                </h1>
                <p className="text-small-medium">
                  Unapproved Note{unapprovedNotes.length > 1 ? "s" : null}
                </p>
              </div>
            </div>
            <div className={`relative ${style.box} flex-1 p-3`}>
              <div className="absolute h-[80px] w-[80px] rounded-full bg-white -left-4 -top-4 flex justify-center items-center">
                <img src={thirdBg} alt="" className="w-4/5 h-4/5" />
              </div>
              <div className="flex flex-col justify-end items-end">
                <h1 className="text-heading1-semibold">
                  {approvedNotes.length}
                </h1>
                <p className="text-small-medium">
                  Approved Note{approvedNotes.length > 1 ? "s" : null}
                </p>
              </div>
            </div>
            <div className={`relative ${style.box} flex-1 p-3`}>
              <div className="absolute h-[80px] w-[80px] rounded-full bg-white -left-4 -top-4 flex justify-center items-center">
                <img src={secBg} alt="" />
              </div>
              <div className="flex flex-col justify-end items-end">
                <h1 className="text-heading1-semibold">
                  {notes.length}
                </h1>
                <p className="text-small-medium">
                  Total Note{notes.length > 1 ? "s" : null}
                </p>
              </div>
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
