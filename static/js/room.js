/*
room.js

The vanillaJs for the frontend responsiveness of the index page of the web app.
*/

try {
	document.getElementById("send-booking-req-btn").addEventListener("click", (event) => {
		event.preventDefault();    // Preventing the default action (auto-submission of form)

		// Validating the user entered data
		if (/^[a-zA-Z ]{6,30}/.test(document.getElementById("send-booking-req-name").value)) {
			if (/^[0-9]{9,11}/.test(document.getElementById("send-booking-req-contact").value)) {
				if ((document.getElementById("send-booking-req-msg").value.length < 500) && (document.getElementById("send-booking-req-msg").value.length > 49)) {
					// If the user input validates (name, contact number, msg in range of 50-500 characters)
					// Sending the POST request
					fetch("/", {
						method: "POST",
						body: JSON.stringify({
							task: "booking request",
							room_id: room_id,
							customer_name: document.getElementById("send-booking-req-name").value,
							customer_msg: document.getElementById("send-booking-req-msg").value,
							customer_contact: document.getElementById("send-booking-req-contact").value,
						}),
						headers: {"Content-type": "application/json; charset=UTF-8"},
					}).then(response => response.text()).then(response => {
						alert(response);
					}).catch(error => {
						alert(error);
					});
				}
			}
		}
	});
} catch(error) {
	// The error might be due to loading a list of rooms instead of a single room, thus we ignore it
	console.log();
}