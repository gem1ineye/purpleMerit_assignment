const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const userObject = user.toObject ? user.toObject() : { ...user };
  delete userObject.password;
  return userObject;
};

export default sanitizeUser;
