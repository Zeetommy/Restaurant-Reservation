import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getReservation, updateReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationEdit({ date }) {
  // Extract reservation_id from the route parameters
  const { reservation_id } = useParams();

  // Define initial state and error state using destructuring
  const [currentReservation, setCurrentReservation] = useState({
    reservation_id,
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: 0,
    reservation_date: "",
    reservation_time: "",
  });
  const [error, setError] = useState(null);

  // Access the history object
  const history = useHistory();

  useEffect(() => {
    // Fetch the reservation data when the component mounts
    getReservation(reservation_id)
      .then((response) => {
        setCurrentReservation({
          ...response,
          people: Number(response.people),
        });
      })
      .catch(setError);
  }, [reservation_id]);

  // Define a handleChange function for input changes
  const handleChange = ({ target }) => {
    setCurrentReservation({
      ...currentReservation,
      [target.name]: target.value,
    });
  };

  // Define a handleSubmit function for form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Ensure that people is a number before submitting
    const updatedReservation = {
      ...currentReservation,
      people: Number(currentReservation.people),
    };

    // Send the updated reservation data to the server
    updateReservation(updatedReservation)
      .then((response) => {
        setCurrentReservation({ ...response });

        // Redirect to the dashboard with the updated date parameter
        history.push(`/dashboard?date=${currentReservation.reservation_date}`);
      })
      .catch(setError);
  };

  return (
    <>
      <h1> Edit Reservation: {reservation_id} </h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className="form-group">
        {/* Input fields with labels */}
        {/* You can use a map function for repetitive input fields to make the code more concise */}
        {[
          {
            label: "First Name",
            name: "first_name",
            placeholder: currentReservation.first_name,
          },
          {
            label: "Last Name",
            name: "last_name",
            placeholder: currentReservation.last_name,
          },
          {
            label: "Mobile Number",
            name: "mobile_number",
            placeholder: currentReservation.mobile_number,
          },
          {
            label: "Party Size",
            name: "people",
            placeholder: currentReservation.people,
            type: "number",
          },
          {
            label: "Reservation Date",
            name: "reservation_date",
            placeholder: currentReservation.reservation_date,
            type: "date",
          },
          {
            label: "Reservation Time",
            name: "reservation_time",
            placeholder: currentReservation.reservation_time,
            type: "time",
          },
        ].map((inputField) => (
          <div className="row mb-3" key={inputField.name}>
            <div className="col-4 form-group">
              <label className="form-label" htmlFor={inputField.name}>
                {inputField.label}
              </label>
              <input
                className="form-control"
                id={inputField.name}
                name={inputField.name}
                type={inputField.type || "text"} // Use type attribute if provided
                onChange={handleChange}
                required={true}
                placeholder={inputField.placeholder}
                value={currentReservation[inputField.name]}
              />
              <small className="form-text text-muted">
                Enter {inputField.label}
              </small>
            </div>
          </div>
        ))}

        {/* Cancel and Submit buttons */}
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit Edit
        </button>
      </form>
    </>
  );
}

export default ReservationEdit;
