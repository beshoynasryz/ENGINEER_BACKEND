const asyncHandler = require('express-async-handler');
const { Note, Project, Review, User } = require("../Associations/Association");
const { getLocalizedMessage } = require('../config/localization/index.js');
const { Op, where } = require('sequelize');

// Define valid specializations
const validSpecializations = ['architect', 'interior']; 

// Get all engineers with optional filters and pagination
const getAllEngineers = asyncHandler(async (req, res) => {
    const { status, specialization, search = '', page = 1, limit = 10 } = req.query;
    const locale = req.locale; // Get locale from the request

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate page and limit
    if (pageNumber < 1 || limitNumber < 1) {
        return res.status(400).json({ 
            error: getLocalizedMessage(locale, 'pagination.invalidPageLimit') || 'Invalid page or limit'
        });
    }

    // Build query options
    const queryOptions = {
        where: {
            role: 'engineer',
            [Op.and]: [
                {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } }, // Case-insensitive search for name
                        { phone_number: { [Op.like]: `%${search}%` } } // Case-insensitive search for phone number
                    ]
                }
            ]
        },
        limit: limitNumber,
        offset: (pageNumber - 1) * limitNumber,
    };

    if (status && ['pending', 'accept', 'reject'].includes(status)) {
        queryOptions.where.status = status;
    }

    if (specialization && validSpecializations.includes(specialization)) {
        queryOptions.where.specialization = specialization;
    } else if (specialization) {
        return res.status(400).json({ 
            error: getLocalizedMessage(locale, 'engineer.invalidSpecialization') || 'Invalid specialization'
        });
    }

    // Fetch engineers with the specified filters and pagination
    const engineers = await User.findAll(queryOptions);

    // Count total engineers for pagination
    const totalEngineers = await User.count({
        where: queryOptions.where
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalEngineers / limitNumber);

    // Send response
    res.json({
        message: getLocalizedMessage(locale, 'engineer.fetchSuccess') || 'Engineers fetched successfully',
        total: totalEngineers,
        totalPages: totalPages,
        page: pageNumber,
        limit: limitNumber,
        data: engineers
    });
});

const getClients = asyncHandler(async (req, res) => {
    const { search = '', page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Validate the pagination parameters
    if (isNaN(pageNumber) || pageNumber < 1 || isNaN(limitNumber) || limitNumber < 1) {
        return res.status(400).json({ message: 'Invalid pagination parameters' });
    }

    // Prepare the filter conditions
    const filterConditions = {
        role: 'client',
        [Op.or]: [
            { name: { [Op.like]: `%${search}%` } }, // Case-insensitive search for client name
            { phone_number: { [Op.like]: `%${search}%` } } // Case-insensitive search for phone number
        ]
    };

    // Fetch clients based on the filter conditions
    const { count, rows } = await User.findAndCountAll({
        where: filterConditions,
        limit: limitNumber,
        offset,
    });

    // Send paginated response
    res.status(200).json({
        total: count,
        totalPages: Math.ceil(count / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
        data: rows.length > 0 ? rows : [],
    });
});
  
const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const locale = req.locale; // Get locale from the request

    // Fetch user with project associations (both client and engineer) and reviews
    const user = await User.findByPk(id, {
        include: [
            {
                model: Project,
                as: 'clientProjects',
                include: [
                    {
                        model: Note,
                        as: 'notes'
                    }
                ]
            },
            {
                model: Project,
                as: 'engineerProjects',
                include: [
                    {
                        model: Note,
                        as: 'notes'
                    }
                ]
            },
            {
                model: Review,
                as: 'engineerReviews'
            }
        ]
    });

    if (!user) {
        return res.status(404).json({ 
            error: getLocalizedMessage(locale, 'user.notFound') 
        });
    }

    // Combine client and engineer projects into a single array
    const userProjects = [
        ...(user.clientProjects || []),
        ...(user.engineerProjects || [])
    ];

    // Ensure notes are not null within each project
    userProjects.forEach(project => {
        project.notes = project.notes || [];
    });

    // Calculate counts for user projects and reviews
    const projectCount = userProjects.length;
    const reviewCount = user.engineerReviews ? user.engineerReviews.length : 0;

    // Calculate total ratings and distribution for each star rating
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    user.engineerReviews.forEach(review => {
        ratingDistribution[review.rating]++;
    });

    const totalRatings = Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0);

    // Convert rating distribution into an array of objects with star and count
    const ratingPercentages = Object.keys(ratingDistribution).map(star => ({
        star: parseInt(star, 10),
        count: ratingDistribution[star],
        percentage: totalRatings > 0 ? ((ratingDistribution[star] / totalRatings) * 100).toFixed(2) : 0
    }));

    const averageStarRating = reviewCount > 0 ? (totalRatings / reviewCount).toFixed(1) : 0;

    // Remove clientProjects and engineerProjects from the user object
    const userData = user.toJSON();
    delete userData.clientProjects;
    delete userData.engineerProjects;

    // Respond with the user data, project count, and rating details
    res.status(200).json({
        message: getLocalizedMessage(locale, 'user.fetchSuccess'),
        user: userData,
        userProjects,
        counts: {
            projectCount,
            reviewCount,
            totalRatings,
            averageStarRating,
            ratingDistribution: ratingPercentages
        }
    });
});

const countEngineers = asyncHandler (async(req,res)=>{

    const locale = req.locale;
    const engineerCount = await User.count({
        where:{role:"engineer"}
    });

    res.status(200).json({
        message :getLocalizedMessage(locale,'engineer.countSuccess') || 'Engineers count fetched successfully',
        count:engineerCount
    })
})
const countClients = asyncHandler(async(req,res)=>{
    locale = req.locale
    const clientCount = await User.count({
        where:{role:"client"}
    });
    res.status(200).json({
        message:getLocalizedMessage(locale,'user.countSuccess') || 'Clients count fetched succesfully',
        count:clientCount
    })
})
const getProfile = asyncHandler(async (req, res) => {
   
    const userId = req.user.id; // Get the user ID from the token via Auth middleware
    const locale = req.locale;
    
    // Fetch the user by ID
    const user = await User.findByPk(userId);
  
    if (!user) {
      return res.status(404).json({ error: getLocalizedMessage(locale, 'user.notFound') });
    }
  
    let profileData;
    if (user.role === 'client') {
      profileData = {
        name: user.name,
        phoneNumber: user.phone_number,
        image: user.image
      };
    } else if (user.role === 'engineer') {
      profileData = {
        name: user.name,
        phoneNumber: user.phone_number,
        image: user.image,
        specialization: user.specialization,
        certification: user.certification,
        status: user.status
      };
    } else {
      return res.status(400).json({ error: getLocalizedMessage(locale, 'user.invalidRole') });
    }
  
    res.json({
      message: getLocalizedMessage(locale, 'user.profileFetchSuccess'),
      profile: profileData
    });
  });
  

const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone_number, specialization, description } = req.body;
    const userId = req.user.id; // Assuming user ID is attached to the request object by authentication middleware
    const locale = req.locale; // Get locale from the request

    // Fetch the user by their ID
    const user = await User.findByPk(userId);

    if (!user) {
        return res.status(404).json({ 
            error: getLocalizedMessage(locale, 'user.notFound') 
        });
    }

    // Construct file paths for uploaded files if they exist
    const imagePath = req.files?.['image'] ? `/images/${req.files['image'][0].filename}` : user.image;
   

    // Update the user fields with the provided values or keep the existing values
    user.name = name || user.name;
    user.phone_number = phone_number || user.phone_number;
    user.image = imagePath; // Update with new path or keep the old one
    user.description = description || user.description;

    if (user.role === 'engineer') {
        user.specialization = specialization || user.specialization;
        
    }

    // Save the updated user profile
    await user.save();

    res.status(200).json({
        message: getLocalizedMessage(locale, 'user.updateSuccess'),
        data: user
    });
});

const deleteUserById = asyncHandler(async (req, res) => {
    const { id } = req.params; // User ID to delete
    const locale = req.locale;

    // Attempt to delete the user directly, without checking for associated projects
    const deletedUser = await User.destroy({
      where: { userID: id },
    });

    if (!deletedUser) {
      return res.status(404).json({
        error: getLocalizedMessage(locale, 'user.notFound') || 'User not found',
      });
    }

    res.status(200).json({
      message: getLocalizedMessage(locale, 'user.deleteSuccess') || 'User deleted successfully',
    });
});

const deleteProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Get the current authenticated user's ID
    const locale = req.locale;
  
    // Check if the user has any associated projects
    const userProjectsCount = await Project.count({
      where: {
        [Op.or]: [{ clientId: userId }, { engineerId: userId }],
      },
    });
  
    if (userProjectsCount > 0) {
      return res.status(400).json({
        error: getLocalizedMessage(locale, 'user.deleteFailedDueToProjects') || 
               'Cannot delete your account because you have associated projects. Please contact an admin for assistance.',
      });
    }
  
    // Attempt to delete the user's profile
    const deletedUser = await User.destroy({
      where: { userID: userId },
    });
  
    if (!deletedUser) {
      return res.status(404).json({
        error: getLocalizedMessage(locale, 'user.notFound') || 'User not found',
      });
    }
  
    res.status(200).json({
      message: getLocalizedMessage(locale, 'user.profileDeleteSuccess') || 'Profile deleted successfully',
    });
});



module.exports = {
    getAllEngineers,
    getUserById,
    getClients,
    getProfile,
    countEngineers,
    countClients,
    updateProfile,
    deleteUserById,
    deleteProfile
};
