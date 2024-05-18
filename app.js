const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utilities/catchAsyncError/catchAsyncError");
const ExpressError = require("./utilities/ExpressError");
const {campgroundSchema} = require("./Schemas")
const methodOverride = require("method-override");
const Campground = require("./models/campground");

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// to use ejsMate
app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const mongoose = require("mongoose");
main()
	.then(() => {
		console.log("MONGO CONNECTION OPEN!!!");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/Presh-Camp", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	}
	else{

		next();
	}
};

// to parse obeject body
app.use(express.urlencoded({ extended: true }));

app.get(
	"/campgrounds",
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);
app.get("/campgrounds/new", async (req, res) => {
	// const campground = await Campground.findById(req.params.id)
	res.render("campgrounds/new");
});
app.post(
	"/campgrounds",
	validateCampground,
	catchAsync(async (req, res, next) => {
		// const campground = await Campground.findById(req.params.id)

		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

app.get("/campgrounds/:id", async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render("campgrounds/edit", { campground });
});

app.get("/makecampground", async (req, res) => {
	const camp = new Campground({
		title: "my Backyard",
		description: "cheap camping",
	});
	await camp.save();
	res.send(camp);
});

app.put(
	"/campgrounds/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

// app.get('/error', (req,res) => {
// 	res.send()
// })
app.all("*", (req, res, next) => {
	next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Something Went Wrong";
	res.status(statusCode).render("Error", { err });
});

app.delete("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect("/campgrounds");
});

app.listen(3000, () => {
	console.log("listening on 3k");
});
