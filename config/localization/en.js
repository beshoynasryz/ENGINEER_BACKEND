module.exports = {
  user: {
      registerSuccess: "User registered successfully",
      passwordMismatch: "Passwords do not match",
      invalidSpecialization: "Invalid specialization",
      loginError: "Password are required",
      userNotFound: "User with ID {id} not found.",
      invalidPassword: "Invalid password",
      accountInactive: "Account is inactive. Please contact the administrator for assistance",
      statusInvalid: "Invalid status",
      statusUpdated: "User status updated successfully",
      fetchSuccess: "User fetched successfully",
      notFound: "User not found",
      invalidRole: "Invalid role",
      profileFetchSuccess: "Profile fetched successfully",
      countSuccess: "Clients count fetched successfully",
      updateSuccess: "User updated successfully.",
      deleteFailedDueToProjects: "Cannot delete your account because you have associated projects. Please contact an admin for assistance.",
      deleteSuccess: "User deleted successfully.",
      profileDeleteSuccess: "Profile deleted successfully.",
      notFound: "User not found.",
      deleteFailed: "Cannot delete user."
  },
  note: {
      contentProjectIdRequired: "Content and project ID are required.",
      projectNotFound: "Project not found.",
      createdSuccessfully: "Note created successfully."
  },
  pagination: {
      invalidPage: "Invalid page parameter",
      invalidLimit: "Invalid limit parameter",
      invalidPageLimit: "Page and limit must be valid numbers."
  },
  engineer: {
      invalidSpecialization: "Invalid specialization",
      fetchSuccess: "Engineers fetched successfully",
      countSuccess: "Engineers count fetched successfully"
  },
  review: {
      createdSuccessfully: "Review created successfully.",
      fetchSuccess: "Reviews fetched successfully."
  },
  project: {
      createSuccess: "Project created successfully.",
      updateSuccess: "Project updated successfully.",
      updateStatusSuccess: "Project status updated successfully.",
      deleteSuccess: "Project deleted successfully.",
      notFound: "Project not found.",
      statusInvalid: "Invalid project status.",
      clientRoleError: "You cannot change the project status. You can only accept or reject the project.",
      engineerRoleError: "You cannot change the project status. You can only mark the project as completed.",
      invalidRole: "Invalid role."
  },
  phone: {
      invalidCode: "Invalid country code.",
      invalidLength: "Phone number should have {expectedLength} digits.",
      invalidLengthSomalia: "Phone number should have {lengths} digits."
  },
  admin: {
    registerSuccess: "Admin registered successfully.",
    loginSuccess: "Login successful.",
    loginInvalidCredentials: "Invalid phone number or password.",
    notFound: "Admin not found.",
    updated: "Admin updated successfully.",
    deleted: "Admin deleted successfully.",
    fetchError: "Error fetching admin profile.",
    fetchProfileSuccess: "Admin profile fetched successfully."
  }
};
