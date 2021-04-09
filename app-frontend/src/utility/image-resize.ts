const dataURItoBlob = (dataURI: string) => {
    // General structure of Data URL: data:[<media_type>][;base64],<data>
    // More info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
    const [data_metadata, data] = dataURI.split(',');
    const isBase64 = data_metadata.indexOf('base64') >= 0;
    const mediaType = data_metadata.split(':')[1].split(";")[0];
    const bytes = isBase64 ? atob(data) : unescape(data);

    const blob = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
        blob[i] = bytes.charCodeAt(i);
    }
    return new Blob([blob], {type: mediaType});
};

const resize = (image: HTMLImageElement, imageType: string, maxSize: number, keepAspectRatio: boolean) => {
    let width = image.width;
    let height = image.height;

    if (keepAspectRatio) {
        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }
    } else {
        width = maxSize;
        height = maxSize;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')!.drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL(imageType);
    return dataURItoBlob(dataUrl);
};

const resizeImage = (file: File, maxSize: number, keepAspectRatio: boolean) => {
    const reader = new FileReader();
    const image = new Image();

    return new Promise<Blob>(resolve => {
        reader.onload = (readerEvent: any) => {
            image.onload = () => resolve(resize(image, file.type, maxSize, keepAspectRatio));
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    })
};

export {resizeImage};