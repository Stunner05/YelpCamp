// const cities = require('./cities');
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const mongoose = require("mongoose");
main()
	.then(() => {
		console.log("MONGO CONNECTION OPEN!!!");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/Presh-Camp", {
		useNewUrlParser: true,
		// useCreateIndex: true,
		useUnifiedTopology: true,
	});
	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//return a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	// delete all in database
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		
		// creat a city with name and state
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: "https://source.unsplash.com/collection/483251",
			description:
				" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem repellendus asperiores expedita corporis nostrum. Possimus voluptatem aliquid debitis ipsum",
				price
		});

		await camp.save();
	}

	// create new campground
};

// close connection
seedDB().then(() => {
	console.log("MONGO CONNECTION CLOSED!!!");

	mongoose.connection.close();
});

// const sample = array => array[Math.floor(Math.random() * array.length)];

// const seedDB = async () => {
//     await Campground.deleteMany({});
//     for (let i = 0; i < 50; i++) {
//         const random1000 = Math.floor(Math.random() * 1000);
//         const camp = new Campground({
//             location: `${cities[random1000].city}, ${cities[random1000].state}`,
//             title: `${sample(descriptors)} ${sample(places)}`
//         })
//         await camp.save();
//     }
// }

// seedDB().then(() => {
//     mongoose.connection.close();
// })
