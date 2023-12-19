/*
index.js

The vanillaJs for the frontend responsiveness of the index page of the web app.
*/

// Adding the onclick event listener to the contact us btn
try {
	document.getElementById("send-contact-req-btn").addEventListener("click", (event) => {
		event.preventDefault();    // Preventing the default action (auto-submission of form)

		// Getting the user entered data
		const customer_msg = document.getElementById("send-contact-req-msg").value;
		const customer_contact = document.getElementById("send-contact-req-contact").value;

		// Validating the user input
		if ((customer_msg.length > 49) && (customer_msg.length <= 500)) {
			if (/^[0-9]{9,11}/.test(customer_contact)) {
				// If the user input validates (msg in the range of 50-500, contact number)
				// Sending the POST request
				fetch("/", {
					method: "POST",
					body: JSON.stringify({
						task: "contact request",
						customer_msg: customer_msg,
						customer_contact: customer_contact,
					}),
					headers: {"Content-type": "application/json; charset=UTF-8"},
				}).then(response => response.text()).then(response => {
					alert(response);
				}).catch(error => {
					alert(error);
				});
			} else {
				// If the contact number doesn't validates
				alert("Please enter an appropriate phone number!");
			}
		} else {
			// If the msg doesn't validates
			alert("Please enter an appropriate message longer than 50 characters and shorter than 500.");
		}
	});
} catch (error) {
	// If there occurs an error
	console.log(error);
}