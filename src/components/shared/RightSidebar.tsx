import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/login.module.css";
import { BookText } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/api/axios";
import { Watch } from "react-loader-spinner";

function RightSidebar() {
  const { user, role } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const getAllNotes = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await axiosPrivate.get("/all-notes");
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched or if an error occurs
    }
  };
  useEffect(() => {
    getAllNotes();
  }, [axiosPrivate]);
  console.log(notes);
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
                      style={{ "--clr": "#fc5f9b" }}
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
