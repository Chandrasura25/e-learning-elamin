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
import { format } from "date-fns";

const lessonSchema = z.object({
  week: z.string().min(1, "Week information is required"),
  date: z.string().min(1, "Date is required"),
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  subTopic: z.string().min(1, "Sub-topic is required"),
  duration: z.string().min(1, "Duration is required"),
  class: z.string().min(1, "Class is required"),
  arm: z.string().min(1, "Arm is required"),
  ageGroup: z.string().min(1, "Age group is required"),
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
  const [classes, setClasses] = useState([]);
  const [arms, setArms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [date, setDate] = useState(null);
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
    const selectedClass = classes.find((c) => c.enrolclass?.id === Number(classId));
    setArms(selectedClass?.arms || []); // Assuming each class has an 'arms' array
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      week: "",
      date: "",
      subject: "",
      topic: "",
      subTopic: "",
      duration: "",
      class: "",
      arm: "",
      ageGroup: "",
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

  const onSubmit = (data: any) => {
    console.log("Lesson Plan Data", data);
    reset(); // Optional: Reset the form after submission
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
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Week
            </label>
            <input
              type="text"
              {...register("week")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="Week 1"
            />
            {errors.week && (
              <p className="text-red-600 text-sm">{errors.week.message}</p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="justify-start flex items-center text-left font-normal w-full p-2 border rounded-md">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
              {...register("subTopic")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="e.g., Photosynthesis"
            />
            {errors.subTopic && (
              <p className="text-red-600 text-sm">{errors.subTopic.message}</p>
            )}
          </div>
        </div>

        {/* Class and Arm Dropdowns */}
        <div className="flex space-x-4">
          <div className="flex-1">
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

          <div className="flex-1">
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
          </div>
        </div>
        {/* Duration, and Age Group */}
        <div className="flex space-x-4">
          <div className="flex-1">
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
              <p className="text-red-600 text-sm">{errors.duration.message}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Age Group
            </label>
            <input
              type="text"
              {...register("ageGroup")}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="e.g., 10-12 Years"
            />
            {errors.ageGroup && (
              <p className="text-red-600 text-sm">{errors.ageGroup.message}</p>
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
          >
            Submit Lesson Plan
          </button>
        </div>
      </form>
    </div>
  );
}
