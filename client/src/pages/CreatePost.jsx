import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageFileUploadError("Please select an image");
        return;
      }
      setImageFileUploadError(null);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError("Image upload failed");
          setImageFileUploadProgress(null);
          setFile(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadProgress(null);
            setFormData({ ...formData, picture: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageFileUploadError("image upload failed");
      setImageFileUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(imageFileUploadProgress){
      setPublishError("Image uploading please wait!")
      return ;
    }
    if ( !formData.picture) {
      setPublishError("Please provide at lease post image");
      return;
    }
    try {
      setPublishLoading(true);
      setPublishError(null);
      const res = await fetch("/api/post/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setPublishLoading(false);
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/`);
      }
    } catch (error) {
      console.log("Something went wrong");
      setPublishLoading(false);
    }
  };
  return (
    <div className="p-3 max-w-xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <TextInput
            type="text"
            id="caption"
            placeholder="Caption"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, caption: e.target.value })
            }
          />          
        </div>
        <div className="flex items-center justify-between gap-4 p-3 border-4 border-teal-500 border-dotted ">
          <TextInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone={"pinkToOrange"}
            outline
            size={"sm"}
            onClick={handleUploadImage}
            disabled={imageFileUploadProgress}
          >
            {imageFileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageFileUploadProgress}
                  text={`${imageFileUploadProgress || 0}%`}
                  styles={{
                    path: {
                      stoke: `rgba(62,152,199,${
                        imageFileUploadProgress / 100
                      })`,
                    },
                  }}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        {formData.picture && (
          <div className="w-full h-72 xs:w-96 xs:h-96 mx-auto">
            <img
            src={formData.picture}
            alt="upload"
            className="w-full h-full object-cover"
          />
          </div>
        )}
        <Button type="submit" gradientDuoTone={"pinkToOrange"}>
          {publishLoading ? (
            <>
              <Spinner size={"sm"} />
              <span className="pl-3">Uploading Post...</span>
            </>
          ) : (
            "Upload Post"
          )}
        </Button>
        {publishError && (
          <Alert className="mt-5" color={"failure"}>
            {" "}
            {publishError}{" "}
          </Alert>
        )}
      </form>
    </div>
  );
}
