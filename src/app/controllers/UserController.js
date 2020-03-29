import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    // Procura o usuário no banco com o ID passado
    const user = await User.findByPk(req.userId);

    // Verifica se o usuário passou o email e se já não existe o email na base
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    // Verifica se ele ta passando a senha e se a senha não esta errada
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // Atualiza os dados e retorna o id,name,provider atualizado
    const { id, name, provider } = await User.update(req.body);

    // Retorna as informações pro front end
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
