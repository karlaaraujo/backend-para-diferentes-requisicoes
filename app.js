const express = require('express');
const app = express();
app.use(express.json());

let alunos = [];

app.get('/alunos', (req, res) => {
    res.json(alunos);
});


app.post('/alunos', (req, res) => {
    const { matricula, nome, email, dataNascimento } = req.body;
    
    // Verificar se a matrícula já existe
    const matriculaExistente = alunos.some(aluno => aluno.matricula === matricula);
    if (matriculaExistente) {
        return res.status(400).json({ error: 'Matrícula já cadastrada' });
    }

    const id = alunos.length ? alunos[alunos.length - 1].id + 1 : 1;
    const novoAluno = { id, matricula, nome, email, dataNascimento };
    alunos.push(novoAluno);
    res.json(novoAluno);
});


app.put('/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { matricula, nome, email, dataNascimento } = req.body;
    
    const alunoIndex = alunos.findIndex(aluno => aluno.id === id);
    if (alunoIndex === -1) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    // Verificar se outra matrícula já existe (excluindo o aluno atual)
    const matriculaExistente = alunos.some(aluno => aluno.matricula === matricula && aluno.id !== id);
    if (matriculaExistente) {
        return res.status(400).json({ error: 'Matrícula já cadastrada para outro aluno' });
    }

    alunos[alunoIndex] = { ...alunos[alunoIndex], matricula, nome, email, dataNascimento };
    res.json(alunos[alunoIndex]);
});


app.delete('/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const alunoIndex = alunos.findIndex(aluno => aluno.id === id);
    if (alunoIndex === -1) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    const alunoRemovido = alunos.splice(alunoIndex, 1);
    res.json(alunoRemovido);
});


const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});