const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const { body, validationResult } = require('express-validator');


const app = express();
app.use(helmet());
app.use(express.json());
app.use(xss());
app.use(mongoSanitize());


// Rate limiter (evita abuso)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);


// Ruta de ejemplo con validación y sanitización
app.post('/api/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().escape()
    ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


    // Aquí: hashing de contraseña (bcrypt)
    // Guardar en BD con mínimo privilegio
    res.json({ message: 'Usuario creado (ejemplo)' });
});


app.get('/health', (req, res) => res.json({ status: 'ok' }));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));


module.exports = app;