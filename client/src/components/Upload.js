import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const AlertBar = ({ message, setAlertMessage, snackType, handleSnackType }) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setAlertMessage(null);
    handleSnackType("");
  };

  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={snackType} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

const Upload = () => {
  const navigate = useNavigate();
  const { user, setAlertMessage, handleSnackType, tags } = useOutletContext();
  const [uploadData, setUploadData] = useState({
    title: "",
    body: "",
    image_file_path: "",
    tags: [],
    postType: "artwork",
  });
  const [showLoginAlert, setShowLoginAlert] = useState(!user);

  useEffect(() => {
    setShowLoginAlert(!user);
  }, [user]);

  const handleChange = (e) => {
    setUploadData({
      ...uploadData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value, 10)
    );

    setUploadData({
      ...uploadData,
      tags: selectedTags.slice(0, 3),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        uploadData.postType === "artwork" ? "/artworks" : "/discussion-posts";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      });

      if (response.ok) {
        handleSnackType("success");
        setAlertMessage("Upload successful!");
        navigate(`/profile/${user.id}`);
      } else {
        const errorData = await response.json();
        handleSnackType("error");
        setAlertMessage(errorData.message || "Upload failed.");
        setShowLoginAlert(!user);
      }
    } catch (error) {
      handleSnackType("error");
      setAlertMessage("An error occurred during upload.");
      setShowLoginAlert(!user);
    }
  };

  return (
    <div>
      {user ? (
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={uploadData.title}
            onChange={handleChange}
          />

          {uploadData.postType === "discussion" && (
            <>
              <label>Body</label>
              <textarea
                name="body"
                value={uploadData.body}
                onChange={handleChange}
              />
            </>
          )}

          <label>Image File Path</label>
          <input
            type="text"
            name="image_file_path"
            value={uploadData.image_file_path}
            onChange={handleChange}
          />
          <label>Tags (Select up to 3)</label>
          <select
            multiple
            name="tags"
            value={uploadData.tags}
            onChange={handleTagChange}
          >
            {tags.map((tag) => (
              <option value={tag.id} key={tag.id}>
                {tag.title}
              </option>
            ))}
          </select>
          <label>Post Type</label>
          <select
            name="postType"
            value={uploadData.postType}
            onChange={handleChange}
          >
            <option value="artwork">Artwork</option>
            <option value="discussion">Discussion Post</option>
          </select>

          <button type="submit">Upload</button>
        </form>
      ) : (
        <AlertBar
          message="Hey! Please login or sign up before uploading."
          setAlertMessage={setAlertMessage}
          snackType="warning"
          handleSnackType={handleSnackType}
        />
      )}
    </div>
  );
};

export default Upload;
