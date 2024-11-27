const asyncHandler = require('express-async-handler');
const { Note, Project, User, Review, Transaction } = require('../Associations/Association');
const { Op } = require('sequelize');
const { getLocalizedMessage } = require('../config/localization/index.js');
const path = require('path');
const axios = require('axios');
const Notification = require('../models/Notification.js'); // Assuming your Notification model is in 'models' folder
const io = require('../app.js'); // Import the io instance
const { count } = require('console');

// Create a new project
const createProject = asyncHandler(async (req, res) => {
  const { projectName, price, clientId } = req.body;

  // Validate if clientId is provided
  if (!clientId) {
    return res.status(400).json({ error: 'Client ID is required' });
  }

  // Create a new project with the provided details
  const newProject = await Project.create({
    projectName,
    price,
    engineerId: req.user.id,  // Assign the authenticated user as engineer
    clientId: clientId,       // Use the provided clientId from the request body
    status: 'pending',        // Default status
  });

  // Notify the customer
  await Notification.create({
    userId: clientId,
    type: 'project_created',
    message: `A new project with ID ${newProject.projectID} has been created.`
  });

  // Emit a socket notification if needed
  // io.io.to(clientId).emit('notification', {
  //   projectID: newProject.projectID,
  //   message: `A new project has been created with ID ${newProject.projectID}.`
  // });

  res.status(201).json({
    message: getLocalizedMessage(req.locale, 'project.createSuccess'),
    project: newProject
  });
});


const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status, country, address, location } = req.body;

  // Get the new files from the request
  const newClientFiles = req.files.client_files || []; // Assuming files are being sent as an array in req.files
  const newEngineerFiles = req.files.engineer_files || []; // Assuming files are being sent as an array in req.files

  // Find the project by its primary key
  const project = await Project.findByPk(projectId);

  if (!project) {
    return res.status(404).json({ message: getLocalizedMessage(req.locale, 'project.notFound') });
  }

  // Update project fields
  if (status) project.status = status;
  if (country) project.country = country;
  if (address) project.address = address;
  if (location) project.location = location;

  // Process and update client files
  if (newClientFiles.length > 0) {
    // Parse the existing client_files from JSON if not already an array
    const existingClientFiles = Array.isArray(project.client_files) ? project.client_files : JSON.parse(project.client_files);

    // Add new files to the existing files
    const updatedClientFiles = [
      ...existingClientFiles,
      ...newClientFiles.map(file => ({
        path: `/images/${path.basename(file.path)}`,
        uploadedAt: new Date().toISOString()
      }))
    ];

    project.client_files = updatedClientFiles;
  }

  // Process and update engineer files
  if (newEngineerFiles.length > 0) {
    // Parse the existing engineer_files from JSON if not already an array
    const existingEngineerFiles = Array.isArray(project.engineer_files) ? project.engineer_files : JSON.parse(project.engineer_files);

    // Add new files to the existing files
    const updatedEngineerFiles = [
      ...existingEngineerFiles,
      ...newEngineerFiles.map(file => ({
        path: `/images/${path.basename(file.path)}`,
        uploadedAt: new Date().toISOString()
      }))
    ];

    project.engineer_files = updatedEngineerFiles;
  }
  await project.save();
  // if (project.engineerId) {
  //   await Notification.create({
  //     userId: project.clientId,
  //     type: 'file_uploaded',
  //     message: `A new file has been uploaded for project ID ${project.projectID}.`
  //   });

  //   // io.io.to(project.engineerId).emit('notification', {
  //   //   projectID: project.projectID,
  //   //   message: `A new file has been uploaded for project ID ${project.projectID}.`
  //   // });
  // }




  // Redirect the user to the payment page
  // const options = {
  //   method: 'POST',
  //   url: 'https://api.tap.company/v2/charges/',
  //   headers: {
  //     accept: 'application/json',
  //     'content-type': 'application/json',
  //     Authorization: `Bearer ${process.env.TAP_SECRET_KEY}` // Ensure TAP_SECRET_KEY is set in your .env file
  //   },
  //   data: {
  //     amount: project.price,
  //     currency: 'KWD',
  //     customer_initiated: true,
  //     threeDSecure: true,
  //     save_card: false,
  //     description: 'Test for payment',
  //     receipt: { email: true, sms: true },
  //     customer: {
  //       first_name: 'Alo',
  //       last_name: 'Fog',
  //       email: 'test@test.com', // Replace with actual customer email
  //     },
  //     metadata: {
  //       projectID: project.projectID,
  //       clientId: project.clientId // Assuming you have user ID in the request object
  //     },
  //     source: { id: 'src_all' },
  //     post: {
  //       url: 'https://acbe-41-233-45-100.ngrok-free.app/api/tap/webhook' // Replace with your actual webhook URL
  //     },
  //     redirect: {
  //       // url: redirect_url // Link to Sofascore
  //       url: 'https://www.linkedin.com/in/muhammed-saleh27/' // Link to Sofascore
  //     }
  //   }
  // };

  try {
    // const response = await axios.request(options);
    // const updateProjectStatus = await Project.findByPk(projectId);
    // if (response.statusText === "OK" && response.data.id) {
    //   updateProjectStatus.status = "PendingTwo"
      // await project.save();// in the future to insure that payment and file are success

      // await updateProjectStatus.save()
      // await Transaction.create({
      //   userID: updateProjectStatus.clientId,
      //   amount: updateProjectStatus.price
      // })
    
      // Notify the lawyer about the successful payment
      // await Notification.create({
      //   userId: updateProjectStatus.clientId, // Assuming lawyerId is available in the project object
      //   type: 'payment_success',
      //   message: `Payment for project ID ${updateProjectStatus.projectID} has been completed.`
      // });

      // io.io.to(updateProjectStatus.clientId).emit('notification', {
      //   projectID: updateProjectStatus.projectID,
      //   message: `Payment for project ID ${updateProjectStatus.projectID} has been successfully processed.`
      // });


    // }
    res.status(200).json({
      // status: 'success',
      // data: response.data,
      // payment_url: response.data.transaction.url, // Redirect URL to the payment page
      message: getLocalizedMessage(req.locale, 'project.updateSuccess'), project
    });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        status: 'error',
        message: error.response.data,
      });
    } else if (error.request) {
      res.status(500).json({
        status: 'error',
        message: 'No response received from Tap API',
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

});

// Get a project by its ID
const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Find the project by primary key and include associated notes, client, engineer, and reviews
  const project = await Project.findByPk(projectId, {
    include: [
      {
        model: Note,
        as: 'notes', // Include associated notes
        attributes: ['noteID', 'content', 'createdAt', 'updatedAt'],
      },
      {
        model: User,
        as: 'client', // Include the associated client
        attributes: ['userID', 'name', 'phone_number'],
      },
      {
        model: User,
        as: 'engineer', // Include the associated engineer
        attributes: ['userID', 'name', 'phone_number', 'specialization'],
        include: [
          {
            model: Review,
            as: 'engineerReviews', // Use the correct alias for reviews
            attributes: ['reviewID', 'rating', 'comment', 'createdAt'],
          },
        ],
      },
    ],
  });

  // Check if the project exists
  if (!project) {
    return res.status(404).json({ message: getLocalizedMessage(req.locale, 'project.notFound') });
  }

  // Respond with the project data, including notes, client, engineer, and reviews
  res.status(200).json({ project });
});

// Get projects by status for the authenticated user
const getProjectsByStatus = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search = '' } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const offset = (pageNumber - 1) * limitNumber;

  // Validate the status parameter if provided
  const validStatuses = ['pending', 'accept', 'reject', 'completed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: getLocalizedMessage(req.locale, 'project.invalidStatus') });
  }

  // Prepare the filter conditions
  const filterConditions = {
    [Op.or]: [
      { engineerId: req.user.id },
      { clientId: req.user.id }
    ],
    projectName: { [Op.like]: `%${search}%` } // Case-insensitive search
  };

  // Include status filter only if status is provided
  if (status) {
    filterConditions.status = status;
  }

  // Fetch projects based on the optional status, user ID, and search query
  const { count, rows } = await Project.findAndCountAll({
    where: filterConditions,
    limit: limitNumber,
    offset,
  });

  res.status(200).json({
    total: count,
    totalPages: Math.ceil(count / limitNumber),
    currentPage: pageNumber,
    limit: limitNumber,
    data: rows.length > 0 ? rows : [],
  });
});

// Get projects by status for admin users
const getProjectsByStatusAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status = 'pending', search = '' } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const offset = (pageNumber - 1) * limitNumber;

  // Validate the status parameter
  const validStatuses = ['accept', 'pending', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: getLocalizedMessage(req.locale, 'project.invalidStatus') });
  }

  // Prepare the filter conditions
  const filterConditions = {
    status,
    projectName: { [Op.like]: `%${search}%` } // Case-insensitive search
  };

  // Fetch projects based on the status and search query
  const { count, rows } = await Project.findAndCountAll({
    where: filterConditions,
    limit: limitNumber,
    offset,
  });

  res.status(200).json({
    total: count,
    totalPages: Math.ceil(count / limitNumber),
    currentPage: pageNumber,
    limit: limitNumber,
    data: rows.length > 0 ? rows : [],
  });
});


// Delete a project by ID
const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the project by its ID
  const project = await Project.findByPk(id);

  if (!project) {
    return res.status(404).json({ message: getLocalizedMessage(req.locale, 'project.notFound') });
  }

  // Check if the user is authorized to delete the project
  if (req.user.role !== 'admin' && project.engineerId !== req.user.id && project.clientId !== req.user.id) {
    return res.status(403).json({ message: getLocalizedMessage(req.locale, 'project.unauthorizedDelete') });
  }

  // Delete the project
  await project.destroy();

  res.status(200).json({ message: getLocalizedMessage(req.locale, 'project.deleteSuccess') });
});

// Update Project Status (Only applicable for customer to accept/decline or engineer to complete)
const updateProjectStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // new status to update

  // Validate status
  if (!['pending', 'accept', 'reject', 'completed'].includes(status)) {
    return res.status(400).json({ message: getLocalizedMessage(req.locale, 'project.invalidStatus') });
  }

  // Fetch the project
  const project = await Project.findByPk(id);
  if (!project) {
    return res.status(404).json({ message: getLocalizedMessage(req.locale, 'project.notFound') });
  }

  // Check user's role and update status accordingly
  const user = await User.findByPk(req.user.id); // Assuming `req.user.id` holds the user's ID
  if (user.role === 'client') {
    // Clients can accept or reject only
    if (status !== 'accept' && status !== 'reject') {
      return res.status(403).json({ message: getLocalizedMessage(req.locale, 'project.clientStatus') });
    }
  } else if (user.role === 'engineer') {
    // Engineers can complete only
    if (status !== 'completed') {
      return res.status(403).json({ message: getLocalizedMessage(req.locale, 'project.engineerStatus') });
    }
  } else {
    return res.status(403).json({ message: getLocalizedMessage(req.locale, 'project.invalidRole') });
  }

  // Update project status
  await project.update({ status });
  console.log(project)

  if (project.clientId) {
    await Notification.create({
      userId: project.clientId,
      type: 'status_changed',
      message: `The status of your case with ID ${project.projectID} has been changed to ${project.status}.`
    });

    // io.io.to(project.clientId).emit('notification', {
    //   projectID: project.projectID,
    //   message: `The status of your project with ID ${project.projectID} has been changed to ${project.status}.`
    // });
    // Additional notifications for "won" or "lost" statuses
    if (project.status === 'won' || project.status === 'lost') {
      const resultMessage = project.status === 'won'
        ? `Congratulations! Your project with ID ${project.projectID} has been won.`
        : `Unfortunately, your project with ID ${project.projectID} has been lost.`;

      await Notification.create({
        userId: project.clientId,
        type: 'project_result',
        message: resultMessage
      });

      // io.io.to(project.clientId).emit('notification', {
      //   projectID: project.projectID,
      //   message: resultMessage
      // });
    }

  }
  res.status(200).json(project);
});

const projectsCountCompleted = asyncHandler (async(req,res)=>{
  locale =req.locale
  const countProject = await Project.count({
    where:{status:"completed"}
  });
  res.status(200).json({
    message:getLocalizedMessage(locale,'project.countSuccess')||'Projects Count fetched succesfully',
    count:countProject
  })
})
const projectsCount = asyncHandler (async(req,res)=>{
  locale =req.locale
  const countProject = await Project.count();
  res.status(200).json({
    message:getLocalizedMessage(locale,'project.countPorject')||'Projects Count fetched succesfully',
    count:countProject
  })
})

module.exports = {
  createProject,
  updateProject,
  getProjectById,
  deleteProject,
  getProjectsByStatus,
  getProjectsByStatusAdmin,
  updateProjectStatus,
  projectsCountCompleted,
  projectsCount
};
