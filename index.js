const axios = require('axios').default;
const config = require("./config.json");

var telegramGroup = config.telegram_channel;

axios.get(telegramGroup)
	.then(async function (response) {
		// Success ✔
		let responseSplit = Array.from(response.data.split(" ")).reverse(); // response.data is reversed so the latest link shows up first ,
		let courseIndex = responseSplit.findIndex(word => word.includes("https://www.udemy.com/course/") && word.includes("?couponCode=")); // Get index of the first course link that shows up (latest one).
		let courseInResponse = responseSplit[courseIndex]
		let courseLink = courseInResponse.substring(6, courseInResponse.length -3); // Delete HTML tags
		
		let coursePage = await axios.get(courseLink)
		let courseHeaderIndex = Array.from(coursePage.data.split("<")).findIndex(word => word.includes("udlite-heading-xl clp-lead__title clp-lead__title--small")); // Get the index of course title
		let course = {
			name: Array.from(coursePage.data.split("<"))[courseHeaderIndex].split("\n")[1], // Get course title
			url:courseLink,
		}
		console.log(course); 
	})
	.catch(function (error) {
		// Fail ✖
		console.log(error);
	})
	.then(function () {
		// always executed 
		console.log("Finished")
	});
