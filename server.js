/*
server.js - DormRoom Dash

This is the main entry point for the App server where we define the various endpoints and also answer to the requests with appropriate response.

Author: Rishav Das (github.com/r1shavd/)
*/

// Importing the required packages
const Fs = require("fs");
const Express = require("express");
const BodyParser = require("body-parser");
const Sqlite3 = require("sqlite3").verbose();

// Creating the express.js powered web App object
const App = Express();

// Setting the veiw engine (template rendering) to ejs
// Note that the default directory location for the ejs files is "views/"
App.set("view engine", "ejs");

// Adding the "scripts/" directory as the static for our express App
App.use(Express.static("static"));

// Defining some of the properties for the POST requests and other body parser properties
App.use(BodyParser.urlencoded({ extended: true }));
App.use(BodyParser.json());

// Connecting to the database
const DbConn = new Sqlite3.Database("database.db", (error) => {
	if (error) {
		// If there arises any error during the connection of database
		console.log("[ Error : connection to database failed ]");
		throw error;
	}
});

// Defining the endpoints of the server
//
// Defining the HTTP GET requests endpoints
//
App.get('/', (request, response) => {
	// Fetching the top 10 rooms from the database
	DbConn.all("SELECT * FROM rooms ORDER BY created_on DESC LIMIT 10", [], (error, rows) => {
		if (error) {
			// If there occurs an error
			response.status(500);
			return response.end("Database error!");
		} else {
			// Fetching the current count of the booking requests from each of the rooms
			return response.render("index", { data: rows, });
		}
	});
});
//
App.get("/rooms", (request, response) => {
	// Getting the room id if provided
	const room_id = request.query.id;
	let data = {
		multiple: false,
		rooms: [],
	};
	if ((room_id == undefined) || (room_id == null)) {
		// If the room id wasn't provided
		// Fetching all the rooms from the database
		DbConn.all("SELECT * FROM rooms;", (error, rows) => {
			if (error) {
				// If there occurs an error
				response.status(500);
				return response.end("Database error!");
			} else {
				// Rendering the page with the fetched room data
				data.multiple = true;
				data.rooms = rows;
				return response.render("room", { data: data },);
			}
		});
	} else {
		// If the room id is provided
		DbConn.get("SELECT * FROM rooms WHERE id = ?;", [room_id], (error, row) => {
			if (error) {
				// If there occurs an error
				response.status(500);
				return response.end("Database error!");
			} else {
			 	try {
					data.multiple = false;
					data.rooms = row;
					data.rooms.media = JSON.parse(data.rooms.media);
					// Fetching the booking requests for the current room
					DbConn.all("SELECT COUNT(*) FROM booking_requests WHERE room_id = ?;", [room_id], (error, row) => {
						if (error) {
							// If there occurs an error
							response.status(500);
							return response.end("Database error!");
						} else {
							// Rendering back the room info to the user
							data.rooms.booking_requests = row;
							return response.render("room", { data: data });
						}
					});
				} catch (error) {
					// If there occurs an error
					response.status(500);
					return response.end("Failed to get the room info!");
				}
			}
		});
	}
});
//
// Defining the HTTP POST requests endpoints
//
App.post('/', (request, response) => {
	// Checking the task
	const task = request.body.task;
	if (task == "booking request") {
		// Adding a booking request for the requested room
		const room_id = request.body.room_id;
		const customer_name = request.body.customer_name;
		const customer_contact = requestt.body.customer_contact;
		const customer_msg = request.body.customer_msg;

		// Checking if the booking request of the same customer exists for the same room
		DbConn.all("SELECT * FROM booking_requests WHERE room_id = ? AND customer_contact = ?", [room_id, customer_contact], (error, row) => {
			if (error) {
				// If there occurs an error
				response.status(500);
			} else {
				// Saving the booking request
				DbConn.run("INSERT INTO booking_request (room_id, customer_name, customer_contact, customer_msg) VALUES (?, ?, ?, ?)", [room_id, customer_name, customer_contact, customer_msg], (error) => {
					if (error) {
						// If there occurs an error
						response.status(500);
						return response.end("Database error!");
					} else {
						return response.end("Booking request accepted!");
					}
				});
			}
		})
	} else if (task == "contact request") {
		// Adding the contact request into the database
		const customer_msg = request.body.customer_msg;
		const customer_contact = request.body.customer_contact;
		DbConn.run("INSERT INTO contact_requests (msg, customer_contact) VALUES (?, ?)", [customer_msg, customer_contact], (error) => {
			if (error) {
				// If there occurs an error
				console.log(error);
				response.status(500);
				return response.end("Database error!");
			} else {
				return response.end("Message sent to the management group!");
			}
		});
	} else {
		// If the task is not defined
		return response.end("Task not defined!");
	}
});
//

// Defining the various objects and functions required
//
// class Crypt{};

// Making the App to listen at port 8000
App.listen(8000, () => {
	console.log('dormroom_dash running and listening to connections at port 8000');
});
