import { v4 as uuidv4 } from 'uuid';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const uploadImage = async (file, folder) => {
    const uniqueName = `${uuidv4()}_${file.name}`; 
    const path = `${folder}/${uniqueName}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
};

export default uploadImage;
