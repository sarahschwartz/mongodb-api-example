import app from './server.js'
import mongodb from 'mongodb'
import dotenv from 'dotenv'
import scenesAccess from './access/scenesAccess.js'
dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4om6k.mongodb.net/${process.env.DB_NS}?retryWrites=true&w=majority`;

MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    wtimeoutMS: 2500
})
    .then(async (client) => {
    await scenesAccess.injectDB(client)
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
