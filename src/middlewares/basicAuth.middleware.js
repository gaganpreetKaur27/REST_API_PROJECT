import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
  //1. check if auth header is empty
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("No authorization details found!");
  }

  console.log("authHeader--", authHeader);
  //2. Extract cred (eg: [Basic quuejejsjsjsj])
  const base64Credentials = authHeader.replace("Basic", "");
  console.log("base64Credentials--", base64Credentials);

  //3. Decode cred
  const decodedCred = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  console.log("decodedCred--", decodedCred); //[username:password]
  const creds = decodedCred.split(":");

  const user = UserModel.getAll().find(
    (u) => u.email === creds[0] && u.password === creds[1]
  );
  if (user) {
    next();
  } else {
    res.status(401).send("Incorrect cred!");
  }
};

export default basicAuthorizer;
