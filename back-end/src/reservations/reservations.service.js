const { KnexTimeoutError } = require("knex");
const knex = require("../db/connection");

function list() {
  return knex("reservations")
    .select("*")
    .whereNot({ status: "finished" })
    .andWhereNot({ status: "cancelled" })
    .orderBy("reservation_time");
}

function create(newReservation) {
  return knex("reservations")
    .insert({
      ...newReservation,
      status: "booked",
    })
    .returning("*")
    .then((result) => result[0]);
}

module.exports = {
  list,
  create,
};