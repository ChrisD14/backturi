require('dotenv').config(); // Carga las variables de entorno del archivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // Puerto del servidor

// Configuración de CORS
        const corsOptions = {
            origin: 'https://turismopis.netlify.app', // Asegúrate de que este valor coincida con el origen de la solicitud
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            optionsSuccessStatus: 204
        };

        app.use(cors(corsOptions));
        

// Middleware
app.use(express.json()); // Permite que Express parsee JSON en el cuerpo de las peticiones

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

// Definir el Esquema y Modelo de Mongoose para las encuestas
const surveySchema = new mongoose.Schema({
    Nombres: { type: String, required: true },
    Apellidos: { type: String, required: true },
    Edad: Number,
    Ciudad: String,
    'Nivel Instrucción': String,
    Ocupación: String,
    'Motivo Visita': String,
    Transporte: String,
    Actividades: String,
    Frecuencia: String,
    Satisfacción: String,
    Opinión: String,
    Timestamp: { type: Date, default: Date.now }
});

const Survey = mongoose.model('Survey', surveySchema);

// Rutas de la API

// Ruta para guardar una nueva encuesta
app.post('/', async (req, res) => {
    try {
        const newSurvey = new Survey(req.body);
        await newSurvey.save();
        res.status(201).json({ message: 'Encuesta guardada con éxito', survey: newSurvey });
    } catch (error) {
        console.error('Error al guardar la encuesta:', error);
        res.status(500).json({ message: 'Error interno del servidor al guardar la encuesta', error: error.message });
    }
});

// Ruta para obtener todas las encuestas
app.get('/', async (req, res) => {
    try {
        const surveys = await Survey.find();
        res.status(200).json(surveys);
    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las encuestas', error: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
