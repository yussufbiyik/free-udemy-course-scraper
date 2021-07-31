const axios = require('axios').default;
const config = require("./config.json");

var telegramGroup = config.telegram_channel;
var regex = /https?:\/\/(www.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)[/?](couponCode=)[A-Z]\w+/g

async function getLatestSingleCourse(response){
	// Match course links
	let courseLinks = String(response.data).match(regex);
	// Get latest course
	let latestCourse = courseLinks.pop()
	// Get course title
	let courseTitle = axios.get(latestCourse).then(response => {
		return response.data.split("<").find(word => word.includes("udlite-heading-xl clp-lead__title clp-lead__title--small")).split("\n")[1]
	})
	// Return course data
	return {
		name: await courseTitle,
		link: latestCourse,
		from: config.telegram_channel
	}
}

async function getAllCoursesFromOneChannel(response){
	// Match course links
	let courseLinks = String(response.data).match(regex);
	// Delete duplicate links
	courseLinks.filter(subject => {
		while(courseLinks.filter(link => link === subject).length != 1){
			courseLinks.splice(courseLinks.findIndex(link => link === subject),1)
		}
	})
	let allCourses = [];
	// Make a request for each link in courseLinks to get course titles
	courseLinks.forEach(link => {
		axios.get(link).then(function (result) {
			// Push course data to allCourses
			allCourses.push({
				courseName: result.data.split("<").find(word => word.includes("udlite-heading-xl clp-lead__title clp-lead__title--small")).split("\n")[1],
				courseLink: link
			});
		}).catch(err => console.log(err))
	})
	return {
		results: allCourses,
		from: config.telegram_channel
	};
}

axios.get(telegramGroup)
	.then(async function (response) {
		// Success ✔
		switch(config.mode){
			default:
				console.log("Please use a valid mode (single | all-from-one)")
			case "single":
				getLatestSingleCourse(response).then(course => console.log(course));
				break;
			case "all-from-one":
				getAllCoursesFromOneChannel(response).then(courses => {
					// wait for allCourses to be listed
					setTimeout(() => {
						console.log(courses)
					}, 5000);
				})
				break;
		}

	})
	.catch(function (error) {
		// Fail ✖
		console.log(error);
	})
