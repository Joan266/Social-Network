const User = require('../models/user');
const generateFakeUsers = require('./generateFakeUsers');

const createUsers = async ({ USERS_NUM, profilePicFilesInfo, bannerFilesInfo }) => {
  const usersIds = [];
  const fakeUsersData = generateFakeUsers(USERS_NUM);

  for (let i = 0; i < USERS_NUM; i++) {
    // Extract fake data from fakeUsersData for user signup
    const { password, email, username, ...rest } = fakeUsersData[i];
    const user = await User.signup({ email, username, password: "1qa2ws3ed!Q" });

    // Prepare user data update for profile
    const userDataUpdate = {
      ...rest,
      profilePicFileId: profilePicFilesInfo[i].profilePicEncryptedFilename,
      bannerFileId: bannerFilesInfo[i].bannerEncryptedFilename
    };

    // Update user with profile and banner images
    const userUpdated = await User.findByIdAndUpdate(user._id, userDataUpdate, { new: true });
    usersIds.push(userUpdated._id);
  }

  return usersIds;
};

module.exports = createUsers;
