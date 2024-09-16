import { axiosPrivate } from "@/api/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { FormField } from "../ui/form";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export const lessonSchema = z.object({
  week: z.string().min(1, "Week information is required"),
  date: z.object({
    from: z.date({ required_error: "From date is required" }),
    to: z.date({ required_error: "To date is required" }).nullable(),
  }),
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  sub_topic: z.string().min(1, "Sub-topic is required"),
  duration: z.string().min(1, "Duration is required"),
  class: z.string().min(1, "Class is required"),
  arm: z.string(),
  age_group: z.string().min(1, "Age group is required"),
  objectives: z.array(z.string()).min(1, "At least one objective is required"),
  resources: z.array(z.string()).min(1, "At least one resource is required"),
  steps: z.object({
    step1: z.object({
      mode: z.string().min(1, "Step I mode is required"),
      teacherActivities: z
        .array(z.string())
        .min(1, "Step I teacher activities are required"),
      studentActivities: z
        .array(z.string())
        .min(1, "Step I student activities are required"),
    }),
    step2: z.object({
      mode: z.string().min(1, "Step II mode is required"),
      teacherActivities: z
        .array(z.string())
        .min(1, "Step II teacher activities are required"),
      studentActivities: z
        .array(z.string())
        .min(1, "Step II student activities are required"),
    }),
    step3: z.object({
      mode: z.string().min(1, "Step III mode is required"),
      teacherActivities: z
        .array(z.string())
        .min(1, "Step III teacher activities are required"),
      studentActivities: z
        .array(z.string())
        .min(1, "Step III student activities are required"),
    }),
    step4: z.object({
      mode: z.string().min(1, "Step IV mode is required"),
      teacherActivities: z
        .array(z.string())
        .min(1, "Step IV teacher activities are required"),
      studentActivities: z
        .array(z.string())
        .min(1, "Step IV student activities are required"),
    }),
    step5: z.object({
      mode: z.string().min(1, "Step V mode is required"),
      teacherActivities: z
        .array(z.string())
        .min(1, "Step V teacher activities are required"),
      studentActivities: z
        .array(z.string())
        .min(1, "Step V student activities are required"),
    }),
  }),
  assignment: z.string().min(1, "Assignment is required"),
  reference: z.string().min(1, "Reference is required"),
});

export function LessonPlanForm() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [arms, setArms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  useEffect(() => {
    const getClasses = async () => {
      try {
        const response = await axiosPrivate.get("/class");
        setClasses(response.data.classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
        // You could also show an error message to the user here
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
      week: "",
      date: "",
      subject: "",
      topic: "",
      sub_topic: "",
      duration: "",
      class: "",
      arm: "",
      age_group: "",
      objectives: [""],
      resources: [""],
      steps: {
        step1: { mode: "", teacherActivities: [""], studentActivities: [""] },
        step2: { mode: "", teacherActivities: [""], studentActivities: [""] },
        step3: { mode: "", teacherActivities: [""], studentActivities: [""] },
        step4: { mode: "", teacherActivities: [""], studentActivities: [""] },
        step5: { mode: "", teacherActivities: [""], studentActivities: [""] },
      },
      assignment: "",
      reference: "",
    },
  });

  const onSubmit = async (data: any) => {
    data.user_id = user?.id;
    setLoading(true);
    try {
      const response = await axiosPrivate.post("/note", data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      reset(); // Optional: Reset the form after submission
    }
  };

  // Helper to generate form sections for Steps
  const renderStepFields = (step: string, index: number) => (
    <div key={index} className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Step {index + 1}</h3>

      {/* Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Mode</label>
        <input
          {...register(`steps.${step}.mode`)}
          className="mt-1 block w-full p-2 border rounded-md"
          placeholder="e.g., Discussion, Lecture, Hands-on"
        />
        {errors.steps?.[step]?.mode && (
          <p className="text-red-600 text-sm">
            {errors.steps[step]?.mode?.message}
          </p>
        )}
      </div>

      {/* Teacher Activities */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Teacher's Activities
        </label>
        <textarea
          {...register(`steps.${step}.teacherActivities.0`)}
          className="mt-1 block w-full p-2 border rounded-md"
          placeholder="Enter teacher's activities"
        />
        {errors.steps?.[step]?.teacherActivities?.[0] && (
          <p className="text-red-600 text-sm">
            {errors.steps[step]?.teacherActivities[0]?.message}
          </p>
        )}
      </div>

      {/* Student Activities */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Students' Activities
        </label>
        <textarea
          {...register(`steps.${step}.studentActivities.0`)}
          className="mt-1 block w-full p-2 border rounded-md"
          placeholder="Enter students' activities"
        />
        {errors.steps?.[step]?.studentActivities?.[0] && (
          <p className="text-red-600 text-sm">
            {errors.steps[step]?.studentActivities[0]?.message}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-md shadow-lg">
      <h2 className="text-heading3-bold text-center mb-8">
        E-Lesson Plan Form
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Week and Date */}
        <div className="flex sm:flex-row flex-col sm:space-x-4">
          <div className="sm:flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Week
            </label>
            <select
              id=""
              className="mt-1 block w-full p-2 border rounded-md"
              {...register("week")}
            >
              {Array.from({ length: 15 }, (_, i) => i + 1).map((week) => (
                <option key={week} value={week}>
                  Week {week}
                </option>
              ))}
            </select>

            {errors.week && (
              <p className="text-red-600 text-sm">{errors.week.message}</p>
            )}
          </div>

          <div className="sm:flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <FormField
              control={control}
              name="date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="justify-start flex items-center text-left font-normal w-full p-2 border rounded-md">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
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
                          // Automatically set the "to" date 7 days from "from" date
                          const autoToDate = addDays(selectedDate.from, 7);
                          setDate({ from: selectedDate.from, to: autoToDate });
                          field.onChange({
                            from: selectedDate.from,
                            to: autoToDate,
                          });
                        } else {
                          // Use the selected "from" and "to" dates if both are selected
                          setDate(selectedDate);
                          field.onChange({
                            from: selectedDate?.from || null,
                            to: selectedDate?.to || null,
                          });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />

            {errors.date && (
              <p className="text-red-600 text-sm">{errors.date.message}</p>
            )}
          </div>
        </div>

        {/* Subject, Topic, and Sub-Topic */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              {...register("subject")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="e.g., Science"
            />
            {errors.subject && (
              <p className="text-red-600 text-sm">{errors.subject.message}</p>
            )}
          </div>
          {/* Class and Arm Dropdowns */}
          <div className="">
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Class
              </label>
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
              {errors.class && (
                <p className="text-red-600 text-sm">{errors.class.message}</p>
              )}
            </div>

            {/* <div className="sm:flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Arm
              </label>
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
              {errors.arm && (
                <p className="text-red-600 text-sm">{errors.arm.message}</p>
              )}
            </div> */}
          </div>
          {/* Duration, and Age Group */}
          <div className="flex sm:flex-row flex-col sm:space-x-4">
            <div className="sm:flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                {...register("duration")}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="e.g., 45 Minutes"
              />
              {errors.duration && (
                <p className="text-red-600 text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>
            <div className="sm:flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Age Group
              </label>
              <input
                type="text"
                {...register("age_group")}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="e.g., 10-12 Years"
              />
              {errors.age_group && (
                <p className="text-red-600 text-sm">
                  {errors.age_group.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Topic
            </label>
            <input
              type="text"
              {...register("topic")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="e.g., Plants and Their Growth"
            />
            {errors.topic && (
              <p className="text-red-600 text-sm">{errors.topic.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sub-Topic
            </label>
            <input
              type="text"
              {...register("sub_topic")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="e.g., Photosynthesis"
            />
            {errors.sub_topic && (
              <p className="text-red-600 text-sm">{errors.sub_topic.message}</p>
            )}
          </div>
        </div>

        {/* Instructional Objectives */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Instructional Objectives
          </label>
          <textarea
            {...register("objectives.0")}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="List your instructional objectives here..."
          />
          {errors.objectives && (
            <p className="text-red-600 text-sm">
              {errors.objectives[0]?.message}
            </p>
          )}
        </div>

        {/* Instructional Resources */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Instructional Resources
          </label>
          <textarea
            {...register("resources.0")}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="List your instructional resources here..."
          />
          {errors.resources && (
            <p className="text-red-600 text-sm">
              {errors.resources[0]?.message}
            </p>
          )}
        </div>

        {/* Steps I to V */}
        {["step1", "step2", "step3", "step4", "step5"].map((step, index) =>
          renderStepFields(step, index)
        )}

        {/* Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assignment
          </label>
          <textarea
            {...register("assignment")}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Assignment details"
          />
          {errors.assignment && (
            <p className="text-red-600 text-sm">{errors.assignment.message}</p>
          )}
        </div>

        {/* Reference */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reference
          </label>
          <textarea
            {...register("reference")}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Reference details"
          />
          {errors.reference && (
            <p className="text-red-600 text-sm">{errors.reference.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-1 hover:bg-red-500 text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Lesson Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}
