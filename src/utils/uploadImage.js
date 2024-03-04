import { getDownloadURL, ref, uploadBytesResumable, listAll } from "firebase/storage";
import { isNil } from "lodash";
import { storage } from "src/contexts/JWTContext";

const { v4: uuidv4 } = require('uuid');

export default async function handleUploadImage(file) {
  
    console.log(file, 'file');
    let uploadUrl = ''
    if (!file) {
        alert("Please upload an image first!");
    }
    const uuidFromString = uuidv4(file.name);
    const storageRef = ref(storage, `${uuidFromString}`);
    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on("state_changed", (snapshot) => { });
    await Promise.all([uploadTask]).then(async (snapshot) => {
        uploadUrl = await getDownloadURL(uploadTask.snapshot.ref)

    })
    console.log('check url 2', uploadUrl)
    return new Promise((resolve) => { resolve(uploadUrl) })
}
export async function handleUploadMultipleFiles(files, packageId) {
    const promises = [];
    let urls = []
    files.forEach(file => {
        promises.push(handleUploadImage(file, packageId, true))
    });
    await Promise.all(promises).then((fileURLS) => {
        urls = fileURLS[0].slice(0, fileURLS[0].search(packageId) + packageId.length + 1)
    })
    return new Promise((resolve) => { resolve(urls) })
}
export async function getAllFile(packageId) {
    let urls = []
    const storageRef = ref(storage, `packages/${packageId}`);
    console.log('store', storageRef);
    await listAll((storageRef)).then(async (res) => {
        res.prefixes.forEach((folderRef) => {
            // All the prefixes under listRef.
            // You may call listAll() recursively on them.
        });
        await Promise.all(res.items.map(async (itemRef) => {
            const uploadUrl = await getDownloadURL(itemRef)
            console.log('url 1', uploadUrl);
            urls = [...urls, uploadUrl]
        }));
    })
    return new Promise((resolve) => { resolve(urls) })
}