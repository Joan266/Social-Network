const faker = require('faker');

// Function to generate fake users
const generateFakeUsers = (USERS_NUM) => {
  const fakeUsers = [];

  // Loop to generate multiple fake users
  for (let i = 0; i < USERS_NUM; i++) {
    // Generate username with symbols
    let usernameWithSymbols = faker.internet.userName();
    
    // Remove symbols and limit to 13 characters maximum
    username = usernameWithSymbols.replace(/\W/g, '').slice(0, 17);

    // Generate fake user object
    const fakeUser = {
      username,
      email: faker.internet.email(),
      password: faker.internet.password(),
      bio: faker.lorem.sentence(),
      birthDate: faker.date.between('1930-01-01', '2015-01-01'), // Generate birthdate between 1930 and 2015
      location: faker.address.country()
    };

    fakeUsers.push(fakeUser);
  }

  return fakeUsers;
};

module.exports = generateFakeUsers;
