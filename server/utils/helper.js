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
  checkAge
};