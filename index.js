const axios = require('axios').default;
const config = require("./config.json");

var telegramGroup = config.telegram_channel;

// Make a request for a user with a given ID
axios.get(telegramGroup)
	.then(async function (response) {
		// Success ✔
		let responseSplit = Array.from(response.data.split(" ")).reverse(); // response.data bir diziye çevirilip ters çeviriliyor ki en son link en başa gelsin,
		let courseIndex = responseSplit.findIndex(word => word.includes("https://www.udemy.com/course/") && word.includes("?couponCode=")); // Dizinin ters çevirilmesi sayesinde arama parametrelerine uyan son linkin indexi alınıyor.
		let courseInResponse = responseSplit[courseIndex]
		let courseLink = courseInResponse.substring(6, courseInResponse.length -3);
		
		let coursePage = await axios.get(courseLink)
		let courseHeaderIndex = Array.from(coursePage.data.split("<")).findIndex(word => word.includes("udlite-heading-xl clp-lead__title clp-lead__title--small"));
		let course = {
			name: Array.from(coursePage.data.split("<"))[courseHeaderIndex].split("\n")[1],
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