const axios = require('axios').default;
const config = require("./config.json");

var telegramGroup = config.telegram_channel;
var regexForCourseLinkDetection = /https?:\/\/(www.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)[/?](couponCode=)[A-Z]\w+/g
var regexForCourseNameDetection = /(?<=(data-purpose="lead-title">))(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+?(?=(<\/h1>))/g
var regexForHTMLEntitiyDetection = /(&.+;)/ig;
var regexForLineBreakDetection = /(\n)/g;

async function getLatestSingleCourse(response) {
	try {
		// Match course links
		let courseLinks = String(response.data).match(regexForCourseLinkDetection);
		// Get latest course
		let latestCourse = courseLinks.pop()
		// Check whether or not the latest course name is null, if so the course is invalid
		if (String(response.data).match(regexForCourseNameDetection) == null) {
			return `Latest Course is Invalid, Course link was: ${latestCourse}`
		} else {
			// Get course title
			let courseTitle = axios.get(latestCourse).then(response => {
				return String(response.data).match(regexForCourseNameDetection).join(' ').replace(regexForHTMLEntitiyDetection, '').replace(regexForLineBreakDetection, '')
			})
			// Return course data
			return {
				name: await courseTitle,
				link: latestCourse,
				from: config.telegram_channel
			}
		}
	} catch (error) {
		console.error(error)
	}
}

async function getAllCoursesFromOneChannel(response) {
	try {
		// Match course links
		let courseLinks = String(response.data).match(regexForCourseLinkDetection);
		// Delete duplicate links
		courseLinks.filter(subject => {
			while (courseLinks.filter(link => link === subject).length != 1) {
				courseLinks.splice(courseLinks.findIndex(link => link === subject), 1)
			}
		})
		let allCourses = [];
		// Make a request for each link in courseLinks to get course titles
		for await (let link of courseLinks) {
			await axios.get(link).then(function (result) {
				// Check whether or not the latest course name is null, if so the course is invalid
				if (String(result.data).match(regexForCourseNameDetection) == null) {
					allCourses.push({
						courseName: 'invalid course',
						courseLink: link
					})
				} else {
					// Push course data to allCourses
					let courseName = String(result.data).match(regexForCourseNameDetection).join(' ').replace(regexForHTMLEntitiyDetection, '').replace(regexForLineBreakDetection, '');
					allCourses.push({
						courseName: courseName,
						courseLink: link
					});
				}
			})
		}
		return {
			results: allCourses,
			from: config.telegram_channel
		};
	} catch (error) {
		console.error(error)
	}
}

if (config.mode === "all-from-one" || config.mode === "single") {
	axios.get(telegramGroup)
		.then(async function (response) {
			// Success ✔
			switch (config.mode) {
				case "single":
					getLatestSingleCourse(response).then(course => console.log(course));
					break;
				case "all-from-one":
					getAllCoursesFromOneChannel(response).then(courses => console.log(courses))
					break;
				default:
					console.log("Please use a valid mode (single | all-from-one)")
			}

		})
		.catch(function (error) {
			// Fail ✖
			console.log(error);
		})
} else {
	console.log("Please use a valid mode (modes: single || all-from-one)")
}
