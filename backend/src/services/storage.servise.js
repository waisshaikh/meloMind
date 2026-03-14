const imagKit = require("@imagekit/nodejs");

const client = new imagKit({
    privatekey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function uploadFile ({buffer,filename,folder = ""}){
    const file = await client.files.upload({
        file:await imagKit.toFile(buffer),
        filename:filename,
        folder
    })
    return file
}

module.exports={uploadFile}