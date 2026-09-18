const Listing = require("../model/listing");

//show all listing
module.exports.index = async (req, res) => {
  const data = await Listing.find({});
  res.render("listing/home.ejs", { data });
};

//render new form
module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

//create listing
module.exports.createListing = async (req, res) => {
  newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  let url = req.file.path;
  let filename = req.file.filename;
  newlisting.image = { url, filename };
  await newlisting.save();
  req.flash("success", "New listing created");
  res.redirect("/listing");
};

//show listing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id).populate([
    { path: "owner" },
    {
      path: "reviews",
      populate: {
        path: "author",
      },
    }, //use [] for multuple objects, {} for single object
  ]);
  if (!list) {
    req.flash("error", "requesting item not in list");
    return res.redirect("/listing");
  }
  res.render("listing/showid.ejs", { list });
};

//render edit form
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "requesting item not in list");
    return res.redirect("/listing");
  }
  let originalImage = list.image.url;
  originalImage = originalImage.replace(
    "/upload",
    "/upload/c_scale,w_300/e_sharpen",
  );
  res.render("listing/editform.ejs", { list, originalImage });
};

//update Listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    list.image = { url, filename };
    await list.save();
  }
  req.flash("success", "List edited");
  res.redirect(`/listing/${id}`);
};

//delete listing
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "List Deleted");
  res.redirect("/listing");
};

// search listing
module.exports.searchListing = async (req, res) => {
  let { q, searchType } = req.query;
  if (!q || q.trim() === "") {
    req.flash("error", "place not found");
    return res.redirect("/listing");
  }

  let searchTerm = q.trim();
  let query = {};
  if (searchType === "country") {
    query = { country: { $regex: searchTerm, $options: "i" } };
  } else if (searchType === "title") {
    query = { title: { $regex: searchTerm, $options: "i" } };
  } else if (searchType === "location" || searchType === "place") {
    query = { location: { $regex: searchTerm, $options: "i" } };
  } else {
    query = {
      $or: [
        { country: { $regex: searchTerm, $options: "i" } },
        { title: { $regex: searchTerm, $options: "i" } },
        { location: { $regex: searchTerm, $options: "i" } },
      ],
    };
  }

  const data = await Listing.find(query);
  if (!data || data.length === 0) {
    req.flash("error", "place not found");
    return res.render("listing/home.ejs", { data: [] });
  }
  res.render("listing/home.ejs", { data });
};
