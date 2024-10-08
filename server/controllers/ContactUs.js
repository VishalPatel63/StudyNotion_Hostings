const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phonenumber, countrycode } = req.body
  console.log("req body",req.body)
  try {
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phonenumber, countrycode)
    )
    console.log("Email Res ", emailRes)
    return res.status(200).json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}