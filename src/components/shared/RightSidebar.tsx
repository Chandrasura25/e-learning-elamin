import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/login.module.css";
import { BookText } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/api/axios";
import { Watch } from "react-loader-spinner";
// Helper function to generate a color based on the subject name
const getColorBySubject = (subject) => {
  // Create a hash from the subject string
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert hash to a color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
};

function RightSidebar() {
  const { user, role } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllNotes = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/all-notes");
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, [axiosPrivate]);

  return (
    <>
      {role === "Teacher" ? (
        <section className="custom-scrollbar rightsidebar">
          <div className="">
            <h4>Lesson Plans</h4>
            <div className={styles.container}>
              <div
                className={styles.box}
                style={{ "--clr": getColorBySubject("Mathematics") }}
              >
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
        <section className="custom-scrollbar rightsidebar">
          <div className="">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Watch
                  height="80"
                  width="80"
                  radius="48"
                  color="#B43330"
                  ariaLabel="watch-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            ) : (
              <>
                <h4>Upcoming Notes</h4>
                <div className={styles.container}>
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className={styles.box}
                      style={{ "--clr": getColorBySubject(note.subject) }}
                    >
                      <div className={styles.content}>
                        <div className={styles.icon}>
                          <BookText />
                        </div>
                        <div className={styles.text}>
                          <h3>{note.subject}</h3>
                          <p>
                            By {note?.user?.firstname} {note?.user?.lastname}
                          </p>
                        </div>
                        <div className="absolute text-tiny-medium text-light-2 bottom-2 right-1">
                          <p>{new Date(note.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default RightSidebar;
