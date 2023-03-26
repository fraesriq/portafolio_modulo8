import { Usuario } from "./models/Usuario.model.js";

const users = [
  { name: "Pedro", email: "pedro@mail.com", password: '123456' },
  { name: "Carlos", email: "carlos@mail.com", password: '123456' },
  { name: "juan", email: "juan@mail.com", password: '123456' }
]

const chargeUsers = async () => {
  for (let index = 0; index < users.length; index++) {
    const [user, created] = await Usuario.findOrCreate({
      where: { name: users[index].name },
      defaults: {
        name: users[index].name,
        email: users[index].email,
        password: users[index].password
      }
    });
  }
}

const main = () => {
  chargeUsers();
}

main();