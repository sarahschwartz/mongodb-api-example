import ScenesAccess from "../access/scenesAccess.js";

export default class ScenesController{
    static async apiGetScenes(req, res) {
        const scenesPerPage = req.query.scenesPerPage ? parseInt(req.req.query.scenesPerPage, 10) : 5
        const page = req.query.page ? parseInt(req.query.page, 10): 0

        let filters = {}
        if (req.query.description) {
            filters.description = req.query.description
        } else if (req.query.creator) {
            filters.creator = req.query.creator
        }

        const { scenesList, totalNumScenes } = await ScenesAccess.getPublicScenes({
            filters,
            page,
            scenesPerPage,
        })

        let response = {
            scenes: scenesList,
            page: page,
            filters: filters,
            scenes_per_page: scenesPerPage,
            total_results: totalNumScenes,
        }
        res.json(response)
    }

    static async apiGetSceneById(req, res) {
        try {
            let id = req.params.id || {}
            let scene = await ScenesAccess.getSceneById(id)
            if (!scene) {
                res.status(404).json({ error: "Not Found" })
                return
            }
            res.json(scene)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e})
        }
    }

    static async apiSaveScene(req, res) {
        try {
            const sceneName = req.body.sceneName
            const creator = req.body.creator
            const description = req.body.description
            const sceneObjects = req.body.sceneObjects
            const date = new Date()
            const background = req.body.background
            const saveSceneResponse = await ScenesAccess.addScene(
                sceneName,
                creator,
                description,
                sceneObjects,
                date,
                background
            )
            res.json({status: "success"})
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    static async apiUpdateScene(req, res) {
        try {
            const scene_id = req.body.scene_id
            const creator = req.body.creator
            const sceneName = req.body.sceneName
            const sceneObjects = req.body.sceneObjects
            const description = req.body.description
            const date = new Date()
            const background = req.body.background
    
            const updateSceneResponse = await ScenesAccess.updateScene(
                scene_id,
                sceneName,
                creator,
                description,
                sceneObjects,
                date,
                background
            )

            var { error } = updateSceneResponse
            if (error) {
                res.status(400).json({ error })
                return
            }
            
            if (updateSceneResponse.modifiedCount === 0) {
                throw new Error("unable to update scene")
            }
            res.json({status: "success"})
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    static async apiDeleteScene(req, res) {
        try {
            const scene_id = req.body.scene_id
            const creator = req.body.creator
            const deleteSceneResponse = await ScenesAccess.deleteScene(
                scene_id,
                creator
            )
            if (deleteSceneResponse.deletedCount === 0) {
                res.status(401).json({error: "Unable to delete scene."})
            } else {
                res.json({status: "success"})
            }
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

}