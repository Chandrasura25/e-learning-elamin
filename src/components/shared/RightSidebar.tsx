import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/login.module.css";
import { BookText } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/api/axios";
import { Watch } from "react-loader-spinner";

// Helper function to generate a color based on the subject name
const getColorBySubject = (subject) => {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
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

  const getNotes = async () => {
    try {
      if (user?.id) {
        setLoading(true); // Set loading to true before fetching data
        const response = await axiosPrivate.get(`/user/${user.id}`);
        setNotes(response.data.notes); // Assuming the API returns an object of notes
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched or if an error occurs
    }
  };

  useEffect(() => {
    if (role === "superadmin") {
      getAllNotes();
    } else {
      getNotes();
    }
  }, [role]); // Adjusted the dependency array to include role, not axiosPrivate

  const unapprovedNotes = notes.filter((note) => note.approved === 0);

  return (
    <>
      {role === "Teacher" ? (
        <section className="custom-scrollbar rightsidebar">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Watch
                height="80"
                width="80"
                radius="48"
                color="#B43330"
                ariaLabel="watch-loading"
              />
            </div>
          ) : (
            <>
              {notes.length > 0 ? (
                <div className={styles.container}>
                  <h4 className="text-light-2 text-heading3-bold">
                    Available Notes
                  </h4>
                  {notes.slice(-5).map((note) => (
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
                          <p>{note?.topic}</p>
                        </div>
                        <div className="absolute text-tiny-medium text-light-2 bottom-2 right-1">
                          <p>
                            {new Date(note.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>There are no notes available</p>
              )}
            </>
          )}
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
                />
              </div>
            ) : (
              <>
                <div className="">
                  <h4>Upcoming Notes</h4>
                  <div className={styles.container}>
                    {unapprovedNotes.length > 0 ? (
                      unapprovedNotes.slice(-3).map((note) => (
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
                                By {note?.user?.firstname}{" "}
                                {note?.user?.lastname}
                              </p>
                            </div>
                            <div className="absolute text-tiny-medium text-light-2 bottom-2 right-1">
                              <p>
                                {new Date(note.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>There are no unapproved notes</p>
                    )}
                  </div>
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
