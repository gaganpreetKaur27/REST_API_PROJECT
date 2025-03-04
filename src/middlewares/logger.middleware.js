import fs from "fs";

const fsPromise = fs.promises;

async function log(logData) {
  try {
    logData = `\n ${new Date().toString()} - ${logData}`;
    fsPromise.appendFile("log.txt", logData);
  } catch (e) {
    console.log(e);
  }
}

const loggerMiddleware = async (req, res, next) => {
  const logData = `${req.url} - ${JSON.stringify(req.body)}`;
  console.log("logData**>>----- ", logData);
  await log(logData);
  next();
};

export default loggerMiddleware;
