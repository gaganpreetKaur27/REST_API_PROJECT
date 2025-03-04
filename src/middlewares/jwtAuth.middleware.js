import jwt from "jsonwebtoken";
const jwtAuth = (req, res, next) => {
  //console.log("rwq-- ", req.headers);
  //1. Read token
  const token = req.headers["authorization"];

  //2. If no token, no error
  if (!token) {
    return res.status(401).send("Unauthorized user");
  }

  //3. check if token is valid
  try {
    const payload = jwt.verify(token, "wkZYG0gSI1msbyPHwELFINVDdzDVM12R"); //token + key with which we have signed the token
    req.userID = payload.userID;
    console.log(payload);
  } catch (e) {
    console.log("e-- ", e);
    //token invalid/expired/modified
    return res.status(401).send("Unauthorized");
  }

  //4. call next middleware
  next();
};

export default jwtAuth;
