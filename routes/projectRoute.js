const express =require('express')
const router = express.Router()
const {createProject, updateProject, getProjectById, deleteProject, getProjectsByStatus, getProjectsByStatusAdmin, updateProjectStatus, projectsCountCompleted, projectsCount} = require ('../controllers/projectController')
const { Auth, AuthorizeRole } = require('../middlewares/AuthMiddleware')
const { upload } = require('../middlewares/uploadMiddleware')

router.post('/create',Auth, AuthorizeRole('engineer','client'),createProject)
router.put('/update/:projectId', upload.fields([
    { name: 'client_files', maxCount: 20}, // Limit to 20 new client files
    { name: 'engineer_files', maxCount: 20 } // Limit to 20 new engineer files
]),Auth,updateProject);
router.get('/:projectId', getProjectById);
router.delete('/projects/:id', Auth, deleteProject);
router.get('/getAll/projects',Auth, AuthorizeRole('engineer','client') ,getProjectsByStatus);
router.get('/admin/getAll',Auth,AuthorizeRole('admin','superadmin'),getProjectsByStatusAdmin)
// Update Project Status
router.put('/status/:id', Auth, updateProjectStatus);
router.get('/count/successProject',projectsCountCompleted)
router.get('/count/AllProject',projectsCount)


module.exports = router;