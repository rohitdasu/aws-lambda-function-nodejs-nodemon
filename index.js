const AWS = require("aws-sdk");
let nodemailer = require("nodemailer");
let ses = new AWS.SES();

exports.handler = async (event, context, error) => {

  let transporter = nodemailer.createTransport({
    SES: ses,
  });
  
  
  /*
  New Code Start
  */
  
  var reciever;
  
  function setEmail(){
    if(event.from=='eduwise'){
      reciever = process.env.toEduwise
    }
    else{
      reciever = process.env.toNearbuzz
    }
  }
  
  setEmail();
  
  function validatePhoneEmail(phone,email){
    
    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6-9]\d{9}$/
    
    if(emailRegex.test(email) && phoneRegex.test(phone)){
      return true;
    }
    else{
      return false;
    }
    
  }
  
  if(!validatePhoneEmail(event.userPhone,event.userEmail)){
    let response = {
      statusCode: 400,
      body: "Failure"
    }
    error(JSON.stringify(response));
    return;
  }
  
  /*
  New Code End
  */
  

  await new Promise((rsv, rjt) => {
    
    transporter.sendMail(
      {
        from: process.env.sender,
        subject: "Form Details | Nearbuzz Website",
        html: 
            `<b>User Name:</b>${event.userName}<br/>
            <b>User Email: </b>${event.userEmail}<br/>
            <b>User Phone Number: </b>${event.userPhone}<br/>
            <b>Organisation Name: </b>${event.organisationName}<br/>
            <b>Business Category: </b>${event.businessCategory}<br/>
            <b>Interested In: </b>${event.interestedIn}<br/>
            <b>Message:</b>${event.message}`,
        to: reciever,
      },
      function (error, info) {
        if (error) {
          rjt(error);
        }
        rsv("Email sent");
      }
    );
  });


  let response = {
    statusCode: 200,
    body: "Success",
  };
  return response;
};
