const gunzipStream = require('./gunzipStream');
const fetch = require('node-fetch');
const uploadPicsumImage = require('./uploadPicsumImage'); // Assuming you have a separate function for uploading Picsum images

// Function to upload home post image list
const uploadHomePostsImageList = async (url) => {
  try {
    // Fetch Picsum List
    const response = await fetch(url);

    // Check if response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Decompress response body
    const decompressedData = await gunzipStream(response.body);

    // Use Promise.all() to upload images concurrently from Picsum List
    const uploadPromises = JSON.parse(decompressedData.toString('utf8')).map(async ({ download_url }) => {
      // Extract height, width, and id properties from image URL
      const [height, width, id] = download_url.split("/").reverse();
      
      // Scale the height 
      const scaledHeight = Math.floor(parseInt(height) * 500 / parseInt(width));
      
      // Modify the Picsum image URL to retrieve the desired size values
      const download_url_modified = `https://picsum.photos/id/${id}/500/${scaledHeight}.webp`;
      
      // Upload Picsum Image to DB
      const { encryptedFilename: postImageFileId } = await uploadPicsumImage({url: download_url_modified, width:500,height:scaledHeight});

      return postImageFileId;
    });

    // Wait for all uploads to complete
    const postImageFileIds = await Promise.all(uploadPromises);

    return postImageFileIds;
  } catch (error) {
    console.error('There was a problem with uploading post images:', error);
    throw error; // Rethrow the error to handle it outside this function
  }
};

module.exports = uploadHomePostsImageList;
