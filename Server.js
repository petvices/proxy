const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Configuración básica
app.use(cors());
app.use(express.json());

// Ruta que coincide con tu ProxyHelper
app.post('/api/proxy', async (req, res) => {
  try {
    const { target_url, payload } = req.body;
    
    // Validación
    if (!target_url || !payload) {
      return res.status(400).json({ error: "Faltan parámetros" });
    }

    // Solo permitir Groq API (seguridad)
    if (!target_url.includes('api.groq.com')) {
      return res.status(403).json({ error: "URL no permitida" });
    }

    // Redirigir la petición
    const response = await axios.post(target_url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      }
    });

    // Devolver respuesta
    res.json(response.data);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy corriendo en puerto ${PORT}`);
});