import style from "@/styles/login.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { axiosPrivate } from "@/api/axios";
import { DateRange } from "react-day-picker";

// Define schemas for both steps
const firstStepSchema = z.object({
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
});

const secondStepSchema = z.object({
  description: z.string().min(2, { message: "Description is required" }),
  materials: z.string().min(2, { message: "Materials are required" }),
  startTime: z.string().min(2, { message: "Starting time is required" }),
  stopTime: z.string().min(2, { message: "Stop time is required" }),
});

export const CreateForm = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [step, setStep] = useState(1); // Track current step
  const [formData, setFormData] = useState({}); // Store form data from all steps
  const [arms, setArms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

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

  // Form handling for first step
  const formFirstStep = useForm({
    resolver: zodResolver(firstStepSchema),
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
    },
  });

  // Form handling for second step
  const formSecondStep = useForm({
    resolver: zodResolver(secondStepSchema),
    defaultValues: {
      description: "",
      materials: "",
      startTime: "",
      stopTime: "",
    },
  });

  // Handle "Next" button for Step 1
  const handleNext = (values: any) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setStep(2); // Move to the next step
  };

  // Handle "Previous" button to go back to Step 1
  const handlePrevious = () => {
    setStep(1); // Go back to the previous step
  };

  // Handle final form submission
  const onSubmit = (values: any) => {
    const finalData = { ...formData, ...values };
    console.log(finalData);
    // You can submit finalData to your API or backend here.
  };
  return (
    <div className={style.body}>
      <div className={`${style.form} w-full`}>
        <h2 className="mb-4">Create your Lesson Note</h2>

        {step === 1 && (
          <Form {...formFirstStep}>
            <form
              onSubmit={formFirstStep.handleSubmit(handleNext)}
              className="space-y-8"
            >
              <div className="flex md:flex-row flex-col gap-4 w-full">
                <FormField
                  control={formFirstStep.control}
                  name="week"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Week</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select the week" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 15 }, (_, i) => i + 1).map(
                            (week) => (
                              <SelectItem key={week} value={`Week ${week}`}>
                                Week {week}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formFirstStep.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col items-start w-full md:w-1/2 ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              className={cn(
                                `justify-start flex items-center text-left font-normal bg-transparent shadow-none text-black border w-full hover:bg-transparent ${style.input}`,
                                !date && "text-muted-foreground"
                              )}
                            >
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
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="range"
                              defaultMonth={date?.from}
                              selected={date}
                              onSelect={(selectedDate) => {
                                if (selectedDate?.from && !selectedDate.to) {
                                  // Automatically set the "to" date 7 days from "from" date
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row flex-col gap-4 w-full">
                <FormField
                  control={formFirstStep.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Subject</FormLabel>
                      <FormControl>
                        <Input
                          className={`border-none focus:border-none focus:outline-none focus:ring-0 ${style.input}`}
                          placeholder="Mathematics"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formFirstStep.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Duration</FormLabel>
                      <FormControl>
                        <Input
                          className={`border-none focus:border-none focus:outline-none focus:ring-0 ${style.input}`}
                          placeholder="30 minutes"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row flex-col gap-4 w-full">
                <FormField
                  control={formFirstStep.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Topic</FormLabel>
                      <FormControl>
                        <Input
                          className={`border-none focus:border-none focus:outline-none focus:ring-0 ${style.input}`}
                          placeholder="Algebra"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formFirstStep.control}
                  name="sub_topic"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Sub-Topic</FormLabel>
                      <FormControl>
                        <Input
                          className={`border-none focus:border-none focus:outline-none focus:ring-0 ${style.input}`}
                          placeholder="Sub heading to the topic."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="px-6 rounded-[20px]">
                Next
              </Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...formSecondStep}>
            <form
              onSubmit={formSecondStep.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="flex md:flex-row flex-col gap-4 w-full">
                <FormField
                  control={formSecondStep.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className={`border-none focus:border-none focus:outline-none focus:ring-0 ${style.input}`}
                          placeholder="Write a brief description of the lesson."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formSecondStep.control}
                  name="materials"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Materials</FormLabel>
                      <FormControl>
                        <textarea
                          className={`border-none focus:border-none focus:outline-none focus:ring-0 ${style.input}`}
                          placeholder="List any materials needed for the lesson."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row flex-col gap-4 w-full">
                <FormField
                  control={formSecondStep.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>
                        Starting Time
                      </FormLabel>
                      <FormControl>
                        <input
                          className={`border-none focus:border-none focus:outline-none focus:ring-0 ${style.input}`}
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formSecondStep.control}
                  name="stopTime"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Stop Time</FormLabel>
                      <FormControl>
                        <input
                          type="time"
                          className={`border-none focus:border-none focus:outline-none focus:ring-0 ${style.input}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Buttons for going back and submitting */}
              <div className="flex justify-center items-center w-full">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    className="px-6 rounded-[20px]"
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                  <Button type="submit" className="px-6 rounded-[20px]">
                    Next
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};
