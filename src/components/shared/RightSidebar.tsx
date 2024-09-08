import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/login.module.css";
import { BookText } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

function RightSidebar() {
  const { user, role } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <>
      {role === "Teacher" ? (
        <section className="custom-scrollbar rightsidebar">
          <div className="">
            <h4>Lesson Plans</h4>
            <div className={styles.container}>
              <div className={styles.box} style={{ "--clr": "#fc5f9b" }}>
                <div className={styles.content}>
                  <div className={styles.icon}>
                    <BookText />
                  </div>
                  <div className={styles.text}>
                    <h3>Mathematics</h3>
                    <p>5 projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center w-full">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg glass text-light-2"
            />
          </div>
        </section>
      ) : (
        <section className="custom-scrollbar rightsidebar"></section>
      )}
    </>
  );
}

export default RightSidebar;
