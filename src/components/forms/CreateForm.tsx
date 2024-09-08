import style from "@/styles/login.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export const CreateForm = () => {
  const [date, setDate] = useState<Date>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className={style.body}>
      <div className={`${style.form} w-full`}>
        <h2 className="mb-4">Create your Lesson Note</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex md:flex-row flex-col gap-4 w-full">
              <FormField
                control={form.control}
                name="username"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem
                    className={`flex flex-col items-start w-full md:w-1/2 ${style.inputBox}`}
                  >
                    <FormLabel className={style.label}>Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            variant={"outline"}
                            className={cn(
                              `justify-start  flex items-center text-left font-normal ${style.input}`,
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
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
                control={form.control}
                name="username"
                rules={{ required: true }}
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
                  control={form.control}
                  name="username"
                  rules={{ required: true }}
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
                  control={form.control}
                  name="username"
                  rules={{ required: true }}
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
            <div className="flex md:flex-row flex-col gap-4 w-full">
                <FormField
                  control={form.control}
                  name="username"
                  rules={{ required: true }}
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
                  control={form.control}
                  name="username"
                  rules={{ required: true }}
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
