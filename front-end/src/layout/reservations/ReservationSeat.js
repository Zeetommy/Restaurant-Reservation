import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateSeat } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationSeat() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the list of tables when the component mounts
    listTables().then(setTables).catch(setError);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedTable) {
      setError("Please select a table to seat the reservation.");
      return;
    }

    try {
      const tableObj = JSON.parse(selectedTable);
      const response = await updateSeat(tableObj.table_id, reservation_id);
      const updatedTables = tables.map((table) =>
        table.table_id === response.table_id ? response : table
      );
      setTables(updatedTables);
      history.push("/dashboard");
    } catch (error) {
      setError("An error occurred while seating the reservation.");
    }
  };

  return (
    <>
      <div className="mb-3">
        <h1>Seat The Current Reservation</h1>
      </div>

      <ErrorAlert error={error} />

      <div className="mb-3">
        <h3>Current Reservation: {reservation_id}</h3>
      </div>

      <form className="form-group" onSubmit={handleSubmit}>
        <div className="col mb-3">
          <label className="form-label" htmlFor="table_id">
            Select Table
          </label>
          <select
            className="form-control"
            name="table_id"
            id="table_id"
            onChange={(event) => setSelectedTable(event.target.value)}
            required={true}
          >
            <option value="">Table Name - Capacity</option>
            {tables.map((table) => (
              <option
                key={table.table_id}
                value={JSON.stringify(table)}
                required={true}
              >
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => history.goBack()}
          className="btn btn-secondary mr-2"
        >
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default ReservationSeat;
