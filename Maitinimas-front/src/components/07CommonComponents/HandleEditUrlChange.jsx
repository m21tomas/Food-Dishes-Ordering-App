//import React from 'react';
import getMimetype from './GetMimeType';

const HandleEditUrlChange = async (event, editCanteenData, setEditCanteenData,
    checkImageUrlString, setImageLoading, setEditUrlLinkValid, setEditBlob) => {

    setEditCanteenData({
        ...editCanteenData,
        [event.target.name]: event.target.value,
    });

    let checkUrl = checkImageUrlString(event);
    if (checkUrl === true) {
        let response;
        var headers = new Headers();

        var requestOptions = {
            method: 'GET',
            headers: headers,
            mode: 'cors',
            cache: 'default'
        };
        try {
            let emptyStr = "";
            let urlString = emptyStr.concat("https://thawing-basin-02600.herokuapp.com/" + event.target.value);
            response = await fetch(urlString, requestOptions);
            setImageLoading(response.status);
        } catch (ex) {
            setEditUrlLinkValid(false);
            console.log("Error response: " + response.status)
            console.error("URL fetch error: \n", ex)
            return null;
        }
        if (!response.ok) {
            setEditUrlLinkValid(false);
            console.error("NOT OK: ", response.status)
        } else if (response.ok) {
            console.log("Response status: ", response.status)
            let imageBlob = await response.blob();
            console.log("duomenys: ", imageBlob);

            if (imageBlob.type.split('/').shift() !== "image") {
                setEditBlob(imageBlob);
                setEditUrlLinkValid(true);
            }
            else if (imageBlob.type === "binary/octet-stream" || imageBlob.type.split('/').shift() === "image") {
                let binaryFileType = undefined;
                let hex = undefined;
                const bytesArray = [];
                const blob = imageBlob.slice(0, 4);
                blob.arrayBuffer()
                    .then(buf => new Uint8Array(buf))
                    .then(bytes => {
                        console.log('BYTES: ', bytes);
                        bytes.forEach((byte) => {
                            bytesArray.push(byte.toString(16))
                        })
                        hex = bytesArray.join('').toUpperCase();
                        binaryFileType = getMimetype(hex);
                        console.log("binaryFileType: ", binaryFileType, " hex: ", hex);
                        if (binaryFileType.split('/').shift() === "image") {
                            setEditBlob(imageBlob);
                            setEditUrlLinkValid(true);
                        }
                        else {
                            setEditUrlLinkValid(false);
                        }
                    })
            }
            else {
                setEditUrlLinkValid(false);
            }
        }
    } else {
        setEditUrlLinkValid(false);
        console.error("Netinkamas URL. Validacija grąžino FALSE")
    }
}

export default HandleEditUrlChange