import { axiosPrivate } from "@/api/axios";
import EditNoteForm from "@/components/forms/EditNoteForm";
import ReviewNoteForm from "@/components/forms/ReviewNoteForm";
import { useState, useEffect } from "react";
import { Watch } from "react-loader-spinner";
import { useParams } from "react-router-dom";

const ReviewNote = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState({});
  const [loading, setLoading] = useState(false);
  const getNote = async () => {
    try {
      if (id) {
        setLoading(true); // Set loading to true before fetching data
        const response = await axiosPrivate.get(`/note/${id}`);
        setPlan(response.data.lesson_plan); // Assuming the API returns an object of notes
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched or if an error occurs
    }
  };
  useEffect(() => {
    getNote();
  }, [id, axiosPrivate]);
  return (
    <div>
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
        <ReviewNoteForm note={plan} />
      )}
    </div>
  );
};

export default ReviewNote;
