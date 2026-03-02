export const validateSignup = (data) => {
  const errors = {};

  const name = data.name?.trim();
  if (!name) {
    errors.name = "Full name is required.";
  } else if (name.length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  if (!data.email) {
    errors.email = "Email address is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export const validateLogin = (data) => {
  const errors = {};

  if (!data.email) {
    errors.email = "Email address is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  }

  return errors;
};
