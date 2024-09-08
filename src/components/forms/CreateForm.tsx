import style from "@/styles/login.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Define schemas for both steps
const firstStepSchema = z.object({
  date: z.date().nullable().refine((val) => !!val, { message: "Date is required" }),
  class: z.string().min(2, { message: "Class is required" }),
  subject: z.string().min(2, { message: "Subject is required" }),
  duration: z.string().min(2, { message: "Duration is required" }),
});

const secondStepSchema = z.object({
  topic: z.string().min(2, { message: "Topic is required" }),
  description: z.string().min(2, { message: "Description is required" }),
  subTopic: z.string().min(2, { message: "Sub-topic is required" }),
  materials: z.string().min(2, { message: "Materials are required" }),
  startTime: z.string().min(2, { message: "Starting time is required" }),
  stopTime: z.string().min(2, { message: "Stop time is required" }),
});

export const CreateForm = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [step, setStep] = useState(1); // Track current step
  const [formData, setFormData] = useState({}); // Store form data from all steps

  // Form handling for first step
  const formFirstStep = useForm({
    resolver: zodResolver(firstStepSchema),
    defaultValues: {
      date: null,
      class: "",
      subject: "",
      duration: "",
    },
  });

  // Form handling for second step
  const formSecondStep = useForm({
    resolver: zodResolver(secondStepSchema),
    defaultValues: {
      topic: "",
      description: "",
      subTopic: "",
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
            <form onSubmit={formFirstStep.handleSubmit(handleNext)} className="space-y-8">
              <div className="flex md:flex-row flex-col gap-4 w-full">
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
                            <button
                              className={cn(
                                `justify-start flex items-center text-left font-normal ${style.input}`,
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(d) => {
                                setDate(d);
                                field.onChange(d);
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
                <FormField
                  control={formFirstStep.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Class</FormLabel>
                      <FormControl>
                        <input
                          className={`border-none focus:border-none focus:outline-none focus:ring-0 ${style.input}`}
                          placeholder="jss1"
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Subject</FormLabel>
                      <FormControl>
                        <input
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
                        <input
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
              <Button type="submit" className="px-6 rounded-[20px]">Next</Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...formSecondStep}>
            <form onSubmit={formSecondStep.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex md:flex-row flex-col gap-4 w-full">
                <FormField
                  control={formSecondStep.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Topic</FormLabel>
                      <FormControl>
                        <input
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
                  control={formSecondStep.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Description</FormLabel>
                      <FormControl>
                        <textarea
                          className={`border-none focus:border-none focus:outline-none focus:ring-0 ${style.input}`}
                          placeholder="Write a brief description of the lesson."
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
                  name="subTopic"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-col w-full md:w-1/2 items-start ${style.inputBox}`}
                    >
                      <FormLabel className={style.label}>Sub-Topic</FormLabel>
                      <FormControl>
                        <input
                          className={`border-none focus:border-none focus:outline-none focus:ring-0 ${style.input}`}
                          placeholder="Sub heading to the topic."
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
                      <FormLabel className={style.label}>Starting Time</FormLabel>
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
              <div className="flex justify-center items-center">
                <div className="flex gap-4">
                <Button type="button" className="px-6 rounded-[20px]" onClick={handlePrevious}>
                  Previous
                </Button>
                <Button type="submit" className="px-6 rounded-[20px]">
                  Submit
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
