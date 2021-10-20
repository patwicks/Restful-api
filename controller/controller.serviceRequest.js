// Local imports
const cloudinary = require("../utility/utility.cloudinary");
const Request = require("../models/model.requestService");

const SEND_REQUEST = async (req, res) => {
  try {
    const urls = [];
    const uploader = async (path) =>
      await cloudinary.uploader.upload(path, {
        folder: "request_attached_images",
      });

    const files = req.files;
    if (req.method === "POST") {
      for (const file of files) {
        const { path } = file;

        const newPath = await uploader(path);
        urls.push(newPath.url);
      }
    } else {
      res.status(405).json({
        errorr: "Images not uploaded successfully",
      });
    }

    const request = new Request({
      transactionMember: [req.body.senderId, req.body.receiverId],
      attachedImages: urls,
      selectedServices: req.body.selectedServices,
      statementMessage: req.body.statementMessage,
      transactionStatus: req.body.transactionStatus,
      driverLatitude: req.body.driverLatitude,
      driverLongitude: req.body.driverLongitude,
    });
    const saveNewRequest = await request.save();

    if (saveNewRequest) {
      res.status(200).json(saveNewRequest);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to request as Service!" });
    console.log(err.message);
  }
};
const FIND_ONE_REQUEST = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    res.json(request);
  } catch (err) {
    res.json({ error: "No request found!" });
  }
};

const CANCEL_REQUEST = async (req, res) => {
  try {
    const request = await Request.updateOne(
      { _id: req.params.requestId },
      {
        $set: {
          transactionStatus: req.body.transactionStatus,
        },
      }
    );
    res.status(200).json({ message: "Cancelled Successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Unexpected error occured. Try again!" });
  }
};

module.exports = {
  SEND_REQUEST,
  FIND_ONE_REQUEST,
  CANCEL_REQUEST
};
