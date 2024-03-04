const uploadPicsumImage = require('./uploadPicsumImage'); 

const uploadProfilesPicAndBanner = async ({ USERS_NUM, profilePicUrl, bannerUrl }) => {
  // Initialize arrays to store profile picture and banner image info
  const profilePicFilesInfo = [];
  const bannerFilesInfo = [];

  // Loop through the number of users to upload profile pictures and banner images
  for (let i = 0; i < USERS_NUM; i++) {
    // Upload profile picture to the database
    const { encryptedFilename: profilePicEncryptedFilename, picsumID: profilePicPicsumID } = await uploadPicsumImage(profilePicUrl);
    profilePicFilesInfo.push({ profilePicEncryptedFilename, profilePicPicsumID });

    // Upload banner image to the database
    const { encryptedFilename: bannerEncryptedFilename, picsumID: bannerPicsumID } = await uploadPicsumImage(bannerUrl);
    bannerFilesInfo.push({ bannerEncryptedFilename, bannerPicsumID });
  }
  
  // Return profile picture and banner image info
  return { profilePicFilesInfo, bannerFilesInfo };
}

module.exports = uploadProfilesPicAndBanner;
