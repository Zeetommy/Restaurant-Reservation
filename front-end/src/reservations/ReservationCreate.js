import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationCreate({ date }) {
  const history = useHistory();
  const [error, setError] = useState(null);

  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: date,
    reservation_time: "",
    people: "1",
  });

  //  Change Handler 
  const handleChange = ({ target }) => {
    setReservation({
      ...reservation,
      [target.name]: target.value,
    });
  };

  // Submit Handler 
  function handleSubmit(event) {
    event.preventDefault();
    createReservation({
      ...reservation,
      people: Number(reservation.people),
    })
      .then(() => {
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch(setError);
  }

  return (
    <>
      <h1> Create A Reservation </h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="first_name">
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              onChange={handleChange}
              required={true}
              value={reservation.first_name}
            />
            <small> Enter First Name </small>
          </div>
          <div>
            <label htmlFor="last_name">
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              onChange={handleChange}
              required={true}
              value={reservation.last_name}
            />
            <small> Enter Last Name </small>
          </div>
        </div>
        <div >
          <div>
            <label htmlFor="mobile_number">
              Mobile Number
            </label>
            <input
              id="mobile_number"
              name="mobile_number"
              type="text"
              onChange={handleChange}
              required={true}
              placeholder="(xxx) xxx-xxxx"
              value={reservation.mobile_number}
            />
            <small>
              {" "}
              Enter Mobile Number{" "}
            </small>
          </div>
          <div >
            <label htmlFor="mobile_number">
              Party Size
            </label>
            <input
              id="people"
              name="people"
              type="number"
              onChange={handleChange}
              required={true}
              value={reservation.people}
            />
            <small > Enter Party Size </small>
          </div>
        </div>
        <div>
          <div>
            <label>Reservation Date</label>
            <input
              id="reservation_date"
              name="reservation_date"
              type="date"
              onChange={handleChange}
              required={true}
              value={reservation.reservation_date}
            />
            <small>
              {" "}
              Enter Reservation Date (Closed on Tuesdays){" "}
            </small>
          </div>
          <div>
            <label>Reservation Time</label>
            <input
              id="reservation_time"
              name="reservation_time"
              type="time"
              onChange={handleChange}
              required={true}
              value={reservation.reservation_time}
            />
            <small>
              {" "}
              Enter Reservation Time{" "}
            </small>
          </div>
        </div>
        <button
          type="button"
          onClick={() => history.goBack()}
        >
          {" "}
          Cancel{" "}
        </button>
        <button type="submit">
          {" "}
          Submit Reservation{" "}
        </button>
      </form>
    </>
  );
}

export default ReservationCreate;
