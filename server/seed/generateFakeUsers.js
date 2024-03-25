const faker = require('faker');
const bioStorage = [
  "Apasionado por la tecnología, amante de los libros y adicto al café. Siempre buscando nuevas aventuras en la vida.",
  "Explorador de la vida, soñador empedernido y eterno optimista. Creyente en el poder de hacer del mundo un lugar mejor.",
  "Ingeniero de día, músico de noche. Amante de los viajes, la buena comida y las conversaciones significativas.",
  "Aprendiz constante, buscando inspiración en cada esquina del mundo. Enamorado de la naturaleza y comprometido con el cambio positivo.",
  "Contador de historias, enamorado de las palabras. Persiguiendo sueños y construyendo puentes hacia un mañana más brillante.",
  "Amante de los gatos, los memes y las buenas vibras. Creyente en el poder de la risa para sanar el alma.",
  "Viajero intrépido, buscando la belleza en cada rincón del planeta. Creyente en la magia de los pequeños momentos.",
  "Emprendedor en ciernes, obsesionado con la innovación y la creatividad. Creando un impacto positivo, un paso a la vez.",
  "Amante de la música, el arte y la buena comida. Siempre en busca de nuevas experiencias y conexiones auténticas.",
  "Entusiasta del fitness, el bienestar y la vida equilibrada. Creyente en el poder de la mente, el cuerpo y el espíritu.",
  "Gamer de corazón, geek por elección. Navegando por la vida con una sonrisa y un control en la mano.",
  "Adicto al cine, amante de las películas clásicas y los debates acalorados. Buscando la próxima gran aventura en la pantalla grande.",
  "Fanático de la cocina, explorador culinario y amante de la comida callejera. Creando magia en la cocina con cada plato.",
  "Filántropo en ciernes, comprometido con hacer del mundo un lugar más justo y equitativo para todos.",
  "Amante de los deportes, el aire libre y las emociones extremas. Siempre listo para el próximo desafío y la aventura sin límites."
];
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
      bio: bioStorage[Math.floor(Math.random() * bioStorage.length)],
      birthDate: faker.date.between('1930-01-01', '2015-01-01'), // Generate birthdate between 1930 and 2015
      location: faker.address.country()
    };

    fakeUsers.push(fakeUser);
  }

  return fakeUsers;
};

module.exports = generateFakeUsers;
