const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // console.log("Role", req.user.role);

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // console.log("Passed authorization middleware...")
    next();
  };
};

module.exports = checkRole;
