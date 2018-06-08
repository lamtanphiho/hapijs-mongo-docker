/**
 * Created by A on 7/18/17.
 */
// docker run -itd -p 127.0.0.1:27017:27017 --name mongo-local  mongo
module.exports = {
    connectString : process.env.connectString || 'mongodb://mongo:27017/hapi-app'
}