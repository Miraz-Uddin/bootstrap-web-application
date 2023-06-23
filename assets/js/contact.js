const validator = $("#commentForm").validate({
  rules: {
    fName: "required",
    lName: "required",
    email: {
      required: true,
      email: true,
    },
    message: "required",
  },
  messages: {
    fName: "Please specify your First name",
    lName: "Please specify your Last name",
    email: {
      required: "We need your email address to contact you",
      email: "Your email address must be in the format of name@domain.com",
    },
    message: "Please Input your Message",
  },
  submitHandler: function (form) {
    document.querySelector("#commentFormAlert").classList.add("show");
  },
});
