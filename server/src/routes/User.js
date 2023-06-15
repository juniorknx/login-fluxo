import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/User.js'

const router = express.Router();

//Register User
router.post('/register', async (req, res) => {
    const { username, name, lastName, city, age, password } = req.body;
    const user = await UserModel.findOne({ username })

    if (user) {
        return res.status(400).json({ message: 'Usuário já existe!' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = UserModel({
        username,
        name,
        lastName,
        city,
        age,
        password: hashedPassword
    })

    await newUser.save()
    res.json({ message: 'Usuário registrado com sucesso!' })
})

//Lista Usuários
/*router.get("/users", verifyToken, async (req, res) => {
    try {
        const user = await UserModel.find({}).select('-password')
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json({ message: "Falha ao obter lista de usuarios" })
    }
}) */

router.get("/users", verifyToken, async (req, res) => {
    try {
        const { name, city } = req.query; // Obter o parâmetro de consulta 'name' da requisição
        let query = {}; // Criar um objeto vazio para a consulta

        if (name) {
            query.name = { $regex: name, $options: "i" }; // Adicionar o filtro pelo nome na consulta ignorando case sensitive
        }

        if(city){
            query.city = { $regex: city, $options: "i" }
        }

        const users = await UserModel.find(query).select('-password'); // Aplicar a consulta
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ message: "Falha ao obter lista de usuários" });
    }
});

//Lista Usuários por ID
router.get("/users/:id", async (req, res) => {
    const { id } = req.params
    try {
        const user = await UserModel.findById(id).select('-password')
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json({ message: "Usuário não encontrado" })
    }
})

//Edita um usuario
router.put('/users/edit/:id', async (req, res) => {
    const { id } = req.params
    const { password } = req.body
    const editUser = req.body
    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            editUser.password = hashedPassword
        }

        const userEdit = await UserModel.findByIdAndUpdate(id, editUser, { new: true }).select('-password')
        res.status(200).json({ message: "Dados atualizados com sucesso!", userEdit, editUser })
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar usuario", erro: error })
    }
})

//Deleta um usuario
router.delete('/users/delete/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleteUser = await UserModel.findByIdAndDelete(id)
        res.status(200).json({ message: "Usuario deletado com sucesso", data: deleteUser })
    } catch (error) {
        res.status(400).json({ message: "Usuário não deletado." })
    }
})

//Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await UserModel.findOne({ username })
    
    if (!user) {
        res.status(404).json({ message: "Usuário Inválido" })
        return
    }
    
    const isPassWordValid = await bcrypt.compare(password, user.password)
    
    if (!isPassWordValid) {
        res.status(401).json({ message: "Senha incorreta" })
        return
    }

    const token = jwt.sign({ id: user._id, }, "secret", {
        expiresIn: '1d'
    })
    res.status(200).json({ token, userID: user._id })
})

//Verifica o token e protege as rotas
function verifyToken(req, res, next) {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, "secret", (err) => {
        if (err) {
            return res.status(401).json({ message: 'Token Inválido ou Expirado!' });
        }

        next();
    });
}

export { router as UserRouter }