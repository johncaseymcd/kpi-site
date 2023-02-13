const crypto = require("crypto");

function generateHashedFileName(firstName, middleName, lastName, email) {
  const timestamp = new Date().getTime();
  const fileName = `${firstName}${middleName}${lastName}${email}${timestamp}`;

  const hashedFileName = crypto.createHash("md5").update(fileName).digest("hex");

  return hashedFileName;
}

function checkAge(birthYear, birthMonth, birthDate, age) {
  const dt = new Date();
  const todayYear = dt.getFullYear();
  const todayMonth = dt.getMonth();
  const todayDate = dt.getDate();

  return (
    birthYear < todayYear - age ||
    (birthYear == todayYear - age && birthMonth < todayMonth) ||
    (birthYear == todayYear - age &&
      birthMonth == todayMonth &&
      birthDate <= todayDate)
  );
}

module.exports = {
  generateHashedFileName,
  checkAge
};