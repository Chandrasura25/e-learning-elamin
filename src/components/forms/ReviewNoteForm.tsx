import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { axiosPrivate } from "@/api/axios";
import { useState } from "react";

const ReviewNoteForm = ({ note }) => {  
  const [supervisorComment, setSupervisorComment] = useState("");
  
  // Function to handle the "Approve" button click
  const handleApprove = async () => {
    try {
      const response = await axiosPrivate.post("/approve", { noteId: note._id });
      console.log("Approval successful:", response.data);
      // You can add any success feedback here (e.g., notifications)
    } catch (error) {
      console.error("Error approving note:", error);
    }
  };

  // Function to handle submitting the supervisor comment
  const handleSubmitComment = async () => {
    try {
      const response = await axiosPrivate.post("/comment", {
        noteId: note._id,
        comment: supervisorComment,
      });
      console.log("Comment submitted successfully:", response.data);
      // You can add any success feedback here (e.g., clearing the comment field)
      setSupervisorComment(""); // Clear the comment field after submission
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  return (
    <>
      <div className="flex justify-end items-end">
        <Button className="bg-green-700" onClick={handleApprove}>
          Approve
        </Button>
      </div>
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-md shadow-lg">
        <h2 className="text-heading3-bold text-center mb-8">
          Review The Lesson Plan
        </h2>
        <div className="space-y-6">
          {/* Week */}
          <div className="flex sm:flex-row flex-col sm:space-x-4">
            <div className="sm:flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Week
              </label>
              <input
                type="text"
                value={note?.week || "N/A"}
                disabled
                className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
              />
            </div>

            {/* Date From - To with Calendar */}
            <div className="sm:flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="justify-start flex items-center text-left font-normal w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed"
                    disabled
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {note?.date_from && note?.date_to ? (
                      <>
                        {format(new Date(note.date_from), "LLL dd, y")} -{" "}
                        {format(new Date(note.date_to), "LLL dd, y")}
                      </>
                    ) : (
                      <span>No Date Available</span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    defaultMonth={
                      note?.date_from ? new Date(note.date_from) : undefined
                    }
                    selected={{
                      from: note?.date_from
                        ? new Date(note.date_from)
                        : undefined,
                      to: note?.date_to ? new Date(note.date_to) : undefined,
                    }}
                    disabled
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              value={note?.subject || "N/A"}
              disabled
              className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          {/* Topic */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Topic
            </label>
            <input
              type="text"
              value={note?.topic || "N/A"}
              disabled
              className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          {/* Sub-Topic */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Sub-Topic
            </label>
            <input
              type="text"
              value={note?.sub_topic || "N/A"}
              disabled
              className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          {/* Duration */}
          <div className="flex sm:flex-row flex-col sm:space-x-4">
            <div className="sm:flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                value={note?.duration || "N/A"}
                disabled
                className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
              />
            </div>

            {/* Age Group */}
            <div className="sm:flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Age Group
              </label>
              <input
                type="text"
                value={note?.age_group || "N/A"}
                disabled
                className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
              />
            </div>
          </div>
          <div className="flex sm:flex-row flex-col sm:space-x-4">
            <div className="sm:flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <input
                type="text"
                value={note?.enrol_class?.name || "N/A"}
                disabled
                className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
              />
            </div>
            <div className="sm:flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Arm
              </label>
              <input
                type="text"
                value={note?.arm?.name || "N/A"}
                disabled
                className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
              />
            </div>
          </div>
          {/* Assignment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Assignment
            </label>
            <textarea
              value={note?.assignment || "N/A"}
              disabled
              className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          {/* Objectives */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Objectives
            </label>
            <textarea
              value={note?.objectives?.join(", ") || "No objectives provided"}
              disabled
              className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          {/* Resources */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Resources
            </label>
            <textarea
              value={note?.resources?.join(", ") || "No resources provided"}
              disabled
              className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
            />
          </div>

          {/* Steps */}
          {note?.steps &&
            Object.keys(note.steps).map((stepKey, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Step {index + 1}</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mode
                  </label>
                  <input
                    type="text"
                    value={note.steps[stepKey]?.mode || "N/A"}
                    disabled
                    className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Teacher's Activities
                  </label>
                  <textarea
                    value={
                      note.steps[stepKey]?.teacherActivities?.join(", ") ||
                      "N/A"
                    }
                    disabled
                    className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Student's Activities
                  </label>
                  <textarea
                    value={
                      note.steps[stepKey]?.studentActivities?.join(", ") ||
                      "N/A"
                    }
                    disabled
                    className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
                  />
                </div>
              </div>
            ))}

          {/* Supervisor Comment */}
          {note?.supervisor_comment && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Supervisor Comment
              </label>
              <textarea
                value={note.supervisor_comment || "No comment"}
                disabled
                className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
              />
            </div>
          )}

          {/* Reference */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Reference
            </label>
            <textarea
              value={note?.reference || "N/A"}
              disabled
              className="mt-1 block w-full p-2 border rounded-md bg-gray-200"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Supervisor Comment
            </label>
            <textarea
              value={supervisorComment}
              onChange={(e) => setSupervisorComment(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md bg-white"
            />
          </div>

          <div className="flex justify-end">
            <Button className="bg-red-1" onClick={handleSubmitComment}>
              Submit Comment
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewNoteForm;
