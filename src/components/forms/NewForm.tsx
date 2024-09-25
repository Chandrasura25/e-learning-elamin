import { axiosPrivate } from "@/api/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import style from "@/styles/login.module.css";
import { FormField } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

const lessonSchema = z.object({
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
  age_group: z.string().min(1, "Age group is required"),
  objectives: z.array(z.string()).min(1, "At least one objective is required"),
  resources: z.array(z.string()).min(1, "At least one resource is required"),
  steps: z.array(
    z.object({
      mode: z.string().min(1, "Mode is required"),
      teacherActivities: z
        .array(z.string())
        .min(1, "Teacher activities are required"),
      studentActivities: z
        .array(z.string())
        .min(1, "Student activities are required"),
    })
  ),
  assignment: z.string().min(1, "Assignment is required"),
  reference: z.string().min(1, "Reference is required"),
});

export default function NewForm() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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
      date: { from: null, to: null },
      subject: "",
      topic: "",
      sub_topic: "",
      duration: "",
      class: "",
      age_group: "",
      objectives: [""],
      resources: [""],
      steps: [{ mode: "", teacherActivities: [""], studentActivities: [""] }],
      assignment: "",
      reference: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
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

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const addStep = () => {
    append({ mode: "", teacherActivities: [""], studentActivities: [""] });
  };

  const removeStep = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    data.user_id = user?.id;
    setLoading(true);
    try {
      const response = await axiosPrivate.post("/note", data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className={style.body}>
      <div className={`${style.form} w-full`}>
        <h2 className="text-heading3-bold text-center mb-8">
          E-Lesson Plan Form
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1 */}
          {currentStep === 0 && (
            <>
              <div className="flex md:flex-row flex-col gap-4">
                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Week
                  </label>
                  <select
                    {...register("week")}
                    className="bg-gray-50 border-none outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    {Array.from({ length: 15 }, (_, i) => i + 1).map((week) => (
                      <option key={week} value={week}>
                        Week {week}
                      </option>
                    ))}
                  </select>
                  {errors.week && (
                    <p className="text-red-600">{errors.week.message}</p>
                  )}
                </div>

                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Date
                  </label>
                  <FormField
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="justify-start flex items-center text-left font-normal w-full p-2 border-none outline-none rounded-md bg-gray-50">
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
                                const autoToDate = addDays(
                                  selectedDate.from,
                                  7
                                );
                                setDate({
                                  from: selectedDate.from,
                                  to: autoToDate,
                                });
                                field.onChange({
                                  from: selectedDate.from,
                                  to: autoToDate,
                                });
                              } else {
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
                  {errors.date?.from && (
                    <p className="text-red-600">{errors.date.from.message}</p>
                  )}
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-4">
                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Subject
                  </label>
                  <input
                    {...register("subject")}
                    className="bg-gray-50 border-none outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.subject && (
                    <p className="text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Topic
                  </label>
                  <input
                    {...register("topic")}
                    className="bg-gray-50 border-none outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.topic && (
                    <p className="text-red-600">{errors.topic.message}</p>
                  )}
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-4">
                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Duration
                  </label>
                  <input
                    {...register("duration")}
                    className="bg-gray-50 border-none outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.duration && (
                    <p className="text-red-600">{errors.duration.message}</p>
                  )}
                </div>
                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Sub-topic
                  </label>
                  <input
                    {...register("sub_topic")}
                    className="bg-gray-50 border-none outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.sub_topic && (
                    <p className="text-red-600">{errors.sub_topic.message}</p>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col gap-4">
                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Class
                  </label>
                  <select
                    {...register("class")}
                    className="bg-gray-50 border-none outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option
                        key={cls?.enrolclass?.id}
                        value={cls?.enrolclass?.id}
                      >
                        {cls?.enrolclass?.name}
                      </option>
                    ))}
                  </select>
                  {errors.class && (
                    <p className="text-red-600">{errors.class.message}</p>
                  )}
                </div>

                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Age Group
                  </label>
                  <input
                    {...register("age_group")}
                    className="bg-gray-50 border-none outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.age_group && (
                    <p className="text-red-600">{errors.age_group.message}</p>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col gap-4">
                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Objectives
                  </label>
                  <textarea
                    {...register("objectives.0")}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-none outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
                  />
                  {errors.objectives?.[0] && (
                    <p className="text-red-600">
                      {errors.objectives[0]?.message}
                    </p>
                  )}
                </div>

                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Resources
                  </label>
                  <textarea
                    {...register("resources.0")}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-none outline-none resize-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.resources?.[0] && (
                    <p className="text-red-600">
                      {errors.resources[0]?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-4">
                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Assignment
                  </label>
                  <input
                    {...register("assignment")}
                    className="bg-gray-50 border-none outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.assignment && (
                    <p className="text-red-600">{errors.assignment.message}</p>
                  )}
                </div>
                <div
                  className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Reference
                  </label>
                  <input
                    {...register("reference")}
                    className="bg-gray-50 border-none outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.reference && (
                    <p className="text-red-600">{errors.reference.message}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-red-500 text-white py-2 px-6 rounded-full text-small-medium"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 2 */}
          {currentStep === 1 && (
            <>
              {fields.map((step, index) => (
                <div key={step.id}>
                  <div className="w-full py-2">
                    <div
                      className={`flex flex-col w-full items-start ${style.inputBox}`}
                    >
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Mode
                      </label>
                      <input
                        {...register(`steps.${index}.mode`)}
                        className="bg-gray-50 border-none outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      {errors.steps?.[index]?.mode && (
                        <p className="text-red-600">
                          {errors.steps[index]?.mode?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-row flex-col gap-4">
                    <div
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Teacher's Activities
                      </label>
                      <textarea
                        {...register(`steps.${index}.teacherActivities.0`)}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-none outline-none resize-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      {errors.steps?.[index]?.teacherActivities?.[0] && (
                        <p className="text-red-600">
                          {errors.steps[index].teacherActivities[0]?.message}
                        </p>
                      )}
                    </div>

                    <div
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Students' Activities
                      </label>
                      <textarea
                        {...register(`steps.${index}.studentActivities.0`)}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-none outline-none resize-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      {errors.steps?.[index]?.studentActivities?.[0] && (
                        <p className="text-red-600">
                          {errors.steps[index].studentActivities[0]?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {fields.length > 1 && (
                    <div className="mt-2 flex justify-center items-center">
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-full text-small-regular text-sm px-5 py-2.5 text-center me-2 mb-2"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-2 flex justify-start items-center">
                <button
                  type="button"
                  onClick={addStep}
                  className="bg-blue text-white py-2 px-6 hover:bg-blue1 transition duration-100 rounded-full text-small-medium"
                >
                  Add More Steps
                </button>
              </div>

              <div className="flex gap-4 justify-center items-center">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium text-sm px-5 py-2.5 text-center text-small-regular me-2 mb-2 rounded-full"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-full text-small-regular text-sm px-5 py-2.5 text-center me-2 mb-2"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
