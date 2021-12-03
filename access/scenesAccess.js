import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

let scenes

export default class ScenesAccess {
    static async injectDB(conn) {
        if (scenes) {
            return
        }
        try {
            scenes = await conn.db(process.env.DB_NS).collection("scenes")
        } catch (e) {
            console.error(`Unable to establish a collection handle: ${e}`
          )
        }
    }

    static async getPublicScenes({
        filters = null,
        page = 0,
        scenesPerPage = 5,
    } = {}) {
        let query
        if (filters) {
            if ("description" in filters) {
                query = { $text: { $search: filters["description"]}}
            } else if ( "creator" in filters) {
                query = { "creator": { $eq: filters["creator"]}}
            }
        }
        
        let cursor
        try {
            cursor = await scenes
            .find(query)
        } catch (e) {
            console.error(`Unable to issue find command ${e}`)
            return { scenesList: [], totalNumScenes: 0 }
        }

        const displayCursor = cursor.limit(scenesPerPage).skip(scenesPerPage * page)
        try {
            const scenesList = await displayCursor.toArray()
            const totalNumScenes = await scenes.countDocuments(query)
            return { scenesList, totalNumScenes}
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents: ${e}`)
            return { scenesList: [], totalNumScenes: 0}
        }
    }

    static async getSceneById(id) {
        let sceneId = ObjectId(id)
        try {
            let foundScenes = await scenes.find({_id: sceneId})
            return foundScenes.toArray()
        } catch (e) {
            console.error(`Unable to find scene: ${e}`)
            return {error: e }
        }
    }


    static async addScene(
        sceneName,
        creator,
        description,
        sceneObjects,
        date,
        background)
    {
        try {
            const sceneDoc = {
                sceneName: sceneName,
                creator: creator,
                description: description,
                sceneObjects: sceneObjects,
                date: date,
                background: background
            }
            return await scenes.insertOne(sceneDoc)
        } catch (e) {
            console.error(`Unable to add scene: ${e}`)
            return {error: e }
        }
        
    }

    // missing authentication here

    static async updateScene(
        scene_id,
        sceneName,
        creator,
        description,
        sceneObjects,
        date,
        background)
    {
        try {
            const updateResponse = await scenes.updateOne(
                { creator: creator, _id: ObjectId(scene_id) },
                {
                    $set: {
                        sceneName: sceneName,
                        sceneObjects: sceneObjects,
                        description: description,
                        date: date,
                        background: background
                    }
                })

            return updateResponse
        } catch (e) {
            console.error(`Unable to update scene: ${e}`)
            return { error: e}
        }
        
    }

    static async deleteScene(scene_id, creator) {
        try {
            const deleteResponse = await scenes.deleteOne(
                { creator: creator, _id: ObjectId(scene_id) }
            )

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete scene: ${e}`)
            return { error: e}
        }
    }
}