import { axiosPrivate } from "@/api/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import style from "@/styles/login.module.css";
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
  steps: z.array(
    z.object({
      mode: z.string().min(1, "Mode is required"),
      teacherActivities: z.array(z.string()).min(1, "Teacher activities are required"),
      studentActivities: z.array(z.string()).min(1, "Student activities are required"),
    })
  ),
  assignment: z.string().min(1, "Assignment is required"),
  reference: z.string().min(1, "Reference is required"),
});

export default function NewForm() {
  const { user } = useAuth();
  const [arms, setArms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
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
      arm: "",
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

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    const selectedClass = classes.find(
      (c) => c.enrolclass?.id === Number(classId)
    );
    setArms(selectedClass?.arms || []);
  };

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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-md shadow-lg">
      <h2 className="text-heading3-bold text-center mb-8">E-Lesson Plan Form</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1 */}
        {currentStep === 0 && (
          <>
            <div>
              <label>Week</label>
              <select {...register("week")} className="form-select">
                {Array.from({ length: 15 }, (_, i) => i + 1).map((week) => (
                  <option key={week} value={week}>
                    Week {week}
                  </option>
                ))}
              </select>
              {errors.week && <p className="text-red-600">{errors.week.message}</p>}
            </div>

            <div>
              <label>Date</label>
              <input
                type="date"
                {...register("date.from")}
                className="form-input"
              />
              {errors.date?.from && (
                <p className="text-red-600">{errors.date.from.message}</p>
              )}
            </div>

            <div>
              <label>Subject</label>
              <input {...register("subject")} className="form-input" />
              {errors.subject && <p className="text-red-600">{errors.subject.message}</p>}
            </div>

            <div>
              <label>Topic</label>
              <input {...register("topic")} className="form-input" />
              {errors.topic && <p className="text-red-600">{errors.topic.message}</p>}
            </div>

            <div>
              <label>Sub-topic</label>
              <input {...register("sub_topic")} className="form-input" />
              {errors.sub_topic && <p className="text-red-600">{errors.sub_topic.message}</p>}
            </div>

            <div>
              <label>Duration</label>
              <input {...register("duration")} className="form-input" />
              {errors.duration && <p className="text-red-600">{errors.duration.message}</p>}
            </div>

            <div>
              <label>Class</label>
              <select
                {...register("class")}
                onChange={handleClassChange}
                className="form-select"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls?.enrolclass?.id} value={cls?.enrolclass?.id}>
                    {cls?.enrolclass?.name}
                  </option>
                ))}
              </select>
              {errors.class && <p className="text-red-600">{errors.class.message}</p>}
            </div>

            <div>
              <label>Age Group</label>
              <input {...register("age_group")} className="form-input" />
              {errors.age_group && <p className="text-red-600">{errors.age_group.message}</p>}
            </div>

            <div>
              <label>Objectives</label>
              <textarea {...register("objectives.0")} className="form-textarea" />
              {errors.objectives?.[0] && <p className="text-red-600">{errors.objectives[0]?.message}</p>}
            </div>

            <div>
              <label>Resources</label>
              <textarea {...register("resources.0")} className="form-textarea" />
              {errors.resources?.[0] && <p className="text-red-600">{errors.resources[0]?.message}</p>}
            </div>

            <button type="button" onClick={nextStep}>
              Next
            </button>
          </>
        )}

        {/* Step 2 */}
        {currentStep === 1 && (
          <>
            {fields.map((step, index) => (
              <div key={step.id}>
                <h3>Step {index + 1}</h3>

                <div>
                  <label>Mode</label>
                  <input {...register(`steps.${index}.mode`)} className="form-input" />
                  {errors.steps?.[index]?.mode && (
                    <p className="text-red-600">{errors.steps[index]?.mode?.message}</p>
                  )}
                </div>

                <div>
                  <label>Teacher's Activities</label>
                  <textarea
                    {...register(`steps.${index}.teacherActivities.0`)}
                    className="form-textarea"
                  />
                  {errors.steps?.[index]?.teacherActivities?.[0] && (
                    <p className="text-red-600">
                      {errors.steps[index].teacherActivities[0]?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label>Students' Activities</label>
                  <textarea
                    {...register(`steps.${index}.studentActivities.0`)}
                    className="form-textarea"
                  />
                  {errors.steps?.[index]?.studentActivities?.[0] && (
                    <p className="text-red-600">
                      {errors.steps[index].studentActivities[0]?.message}
                    </p>
                  )}
                </div>

                {fields.length > 1 && (
                  <button type="button" onClick={() => removeStep(index)}>
                    Remove Step
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={addStep}>
              Add More Steps
            </button>

            <div>
              <button type="button" onClick={prevStep}>
                Previous
              </button>
              <button type="submit">Submit</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
