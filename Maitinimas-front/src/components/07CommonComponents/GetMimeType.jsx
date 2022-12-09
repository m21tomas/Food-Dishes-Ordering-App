
const GetMimeType = (signature) => {

    if(signature.substr(0,4) === '424D'){
        signature = '424D'
    }

    switch (signature) {
        case 'FFD8FFDB':
        case 'FFD8FFE0':
        case 'FFD8FFE1':
            return 'image/jpeg'
        case '89504E47':
            return 'image/png'
        case '47494638':
            return 'image/gif'
        case '49492A0':
            return 'image/tiff'
        case '424D':
            return 'image/bmp'
        case '0010':
            return 'image/x-icon'
        case '25504446':
            return 'application/pdf'
        case '504B0304':
            return 'application/zip'
        default:
            return 'Unknown filetype'
    }
}

export default GetMimeType