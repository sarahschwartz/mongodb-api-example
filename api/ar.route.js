import express from 'express'
import ScenesController from './scenes.controller.js'

const router = express.Router()
router.route('/ar').get(ScenesController.apiGetScenes)
router.route('/ar/id/:id').get(ScenesController.apiGetSceneById)

router
    .route('/ar/scene')
    .post(ScenesController.apiSaveScene)
    .put(ScenesController.apiUpdateScene)
    .delete(ScenesController.apiDeleteScene)

export default router