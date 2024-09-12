import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "react-toastify";
import { axiosPrivate } from "@/api/axios";
import { lessonSchema } from "./LessonPlanForm";

const EditNoteForm = ({ note }) => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [arms, setArms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(note?.class || "");
  const [date, setDate] = useState<DateRange | undefined>({
    from: note?.date?.from ? new Date(note.date.from) : undefined,
    to: note?.date?.to ? new Date(note.date.to) : undefined,
  });

  useEffect(() => {
    const getClasses = async () => {
      try {
        const response = await axiosPrivate.get("/class");
        setClasses(response.data.classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    getClasses();
  }, []);

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    const selectedClass = classes.find(
      (c) => c.enrolclass?.id === Number(classId)
    );
    setArms(selectedClass?.arms || []);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      week: note?.week || "",
      date: note?.date || { from: "", to: "" },
      subject: note?.subject || "",
      topic: note?.topic || "",
      sub_topic: note?.sub_topic || "",
      duration: note?.duration || "",
      class: note?.class || "",
      arm: note?.arm || "",
      age_group: note?.age_group || "",
      objectives: note?.objectives || [""],
      resources: note?.resources || [""],
      steps: note?.steps || {
        step1: { mode: "", teacherActivities: [""], studentActivities: [""] },
        step2: { mode: "", teacherActivities: [""], studentActivities: [""] },
        step3: { mode: "", teacherActivities: [""], studentActivities: [""] },
        step4: { mode: "", teacherActivities: [""], studentActivities: [""] },
        step5: { mode: "", teacherActivities: [""], studentActivities: [""] },
      },
      assignment: note?.assignment || "",
      reference: note?.reference || "",
    },
  });

  useEffect(() => {
    reset(note); // Reset form with note data when the component mounts or note changes
  }, [note, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.put(`/note/${note.id}`, data);
      toast.success("Lesson plan updated successfully!");
    } catch (error) {
      toast.error("Error updating lesson plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to render steps fields
  const renderStepFields = (step, index) => (
    <div key={index} className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Step {index + 1}</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Mode</label>
        <input
          {...register(`steps.${step}.mode`)}
          className="mt-1 block w-full p-2 border rounded-md"
          placeholder="e.g., Discussion, Lecture, Hands-on"
        />
        {errors.steps?.[step]?.mode && (
          <p className="text-red-600 text-sm">{errors.steps[step]?.mode?.message}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Teacher's Activities</label>
        <textarea
          {...register(`steps.${step}.teacherActivities.0`)}
          className="mt-1 block w-full p-2 border rounded-md"
          placeholder="Enter teacher's activities"
        />
        {errors.steps?.[step]?.teacherActivities?.[0] && (
          <p className="text-red-600 text-sm">{errors.steps[step]?.teacherActivities[0]?.message}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Students' Activities</label>
        <textarea
          {...register(`steps.${step}.studentActivities.0`)}
          className="mt-1 block w-full p-2 border rounded-md"
          placeholder="Enter students' activities"
        />
        {errors.steps?.[step]?.studentActivities?.[0] && (
          <p className="text-red-600 text-sm">{errors.steps[step]?.studentActivities[0]?.message}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-md shadow-lg">
      <h2 className="text-heading3-bold text-center mb-8">Edit Lesson Plan</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex sm:flex-row flex-col sm:space-x-4">
          <div className="sm:flex-1">
            <label className="block text-sm font-medium text-gray-700">Week</label>
            <input
              type="text"
              {...register("week")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="Week 1"
            />
            {errors.week && <p className="text-red-600 text-sm">{errors.week.message}</p>}
          </div>

          <div className="sm:flex-1">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="justify-start flex items-center text-left font-normal w-full p-2 border rounded-md">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (selectedDate?.from && !selectedDate.to) {
                      const autoToDate = addDays(selectedDate.from, 7);
                      setDate({ from: selectedDate.from, to: autoToDate });
                    } else {
                      setDate(selectedDate);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              {...register("subject")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="e.g., Science"
            />
            {errors.subject && <p className="text-red-600 text-sm">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Topic</label>
            <input
              type="text"
              {...register("topic")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="e.g., Plants and Their Growth"
            />
            {errors.topic && <p className="text-red-600 text-sm">{errors.topic.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sub-Topic</label>
            <input
              type="text"
              {...register("sub_topic")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="e.g., Photosynthesis"
            />
            {errors.sub_topic && <p className="text-red-600 text-sm">{errors.sub_topic.message}</p>}
          </div>
        </div>

        <div className="flex sm:flex-row flex-col sm:space-x-4">
          <div className="sm:flex-1">
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select
              {...register("class")}
              onChange={handleClassChange}
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls?.enrolclass?.id} value={cls?.enrolclass?.id}>
                  {cls?.enrolclass?.name}
                </option>
              ))}
            </select>
            {errors.class && <p className="text-red-600 text-sm">{errors.class.message}</p>}
          </div>

          <div className="sm:flex-1">
            <label className="block text-sm font-medium text-gray-700">Arm</label>
            <select
              {...register("arm")}
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="">Select Arm</option>
              {arms.map((arm) => (
                <option key={arm.id} value={arm.id}>
                  {arm.name}
                </option>
              ))}
            </select>
            {errors.arm && <p className="text-red-600 text-sm">{errors.arm.message}</p>}
          </div>
        </div>

        <div className="flex sm:flex-row flex-col sm:space-x-4">
          <div className="sm:flex-1">
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input
              type="text"
              {...register("duration")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="e.g., 45 Minutes"
            />
            {errors.duration && <p className="text-red-600 text-sm">{errors.duration.message}</p>}
          </div>

          <div className="sm:flex-1">
            <label className="block text-sm font-medium text-gray-700">Age Group</label>
            <input
              type="text"
              {...register("age_group")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="e.g., 10-12 Years"
            />
            {errors.age_group && <p className="text-red-600 text-sm">{errors.age_group.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Instructional Objectives</label>
          <textarea
            {...register("objectives.0")}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="List your instructional objectives here..."
          />
          {errors.objectives && <p className="text-red-600 text-sm">{errors.objectives[0]?.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Instructional Resources</label>
          <textarea
            {...register("resources.0")}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="List your instructional resources here..."
          />
          {errors.resources && <p className="text-red-600 text-sm">{errors.resources[0]?.message}</p>}
        </div>

        {["step1", "step2", "step3", "step4", "step5"].map((step, index) =>
          renderStepFields(step, index)
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Assignment</label>
          <textarea
            {...register("assignment")}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Assignment details"
          />
          {errors.assignment && <p className="text-red-600 text-sm">{errors.assignment.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reference</label>
          <textarea
            {...register("reference")}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Reference details"
          />
          {errors.reference && <p className="text-red-600 text-sm">{errors.reference.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Lesson Plan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNoteForm;
