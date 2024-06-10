export function calculateAge(birthDate) {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  // Adjust age if the birth date hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
}

// Example usage
// const birthDate = '1990-05-25';  // Replace with your birth date in YYYY-MM-DD format
// const age = calculateAge(birthDate);
// console.log("Age:", age);
