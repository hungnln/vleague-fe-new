// import { decode as base64_decode, encode as base64_encode } from 'base-64';
export const toBase64 = file => {
    const x = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.toString().substr(reader.result.toString().indexOf(',') + 1));
        reader.onerror = error => reject(error);
    })
    return x
}

export const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    blob.Properties.ContentType = "image/png"
    return toBase64(blob);
}

export const getBase64Image = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const x = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result.toString().substr(reader.result.toString().indexOf(',') + 1));
        reader.onerror = (error) => {
            reject(error);
        };
    })
    return x
}
// getBase64Image('https://uploads.sitepoint.com/wp-content/uploads/2015/12/1450377118cors3.png')
// export const toDataURL = url => fetch(url)
//     .then(response => response.blob())
//     .then(blob => new Promise((resolve, reject) => {
//         const reader = new FileReader()
//         reader.onload = () => resolve(reader.result.toString().substr(reader.result.toString().indexOf(',') + 1));
//         reader.onerror = reject
//         reader.readAsDataURL(blob)
//     }))
