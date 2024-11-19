import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 5000;
const user = 'salsasrenicorporativo@gmail.com'; // Tu correo electrónico
const pass = 'SalsasReny2002'; // Tu contraseña de correo (considera usar una contraseña de aplicación)

app.use(cors({ 
  origin: 'http://localhost:5173', // Permitir solo el origen de tu frontend
  methods: ['GET', 'POST'], // Métodos permitidos
}));

app.use(bodyParser.json()); // Middleware para analizar el cuerpo de la solicitud como JSON

const transporter = nodemailer.createTransport({
  service: 'gmail', // Servicio de Gmail
  auth: {
    user: user, // Correo electrónico
    pass: pass, // Contraseña de correo
  },
});

app.post('/api/enviarCorreo', (req, res) => {
  const { emailCliente } = req.body; // Obtener el correo electrónico del cliente
  console.log('Correo del cliente:', emailCliente); // Verificar el valor de emailCliente

  if (!emailCliente) {
    return res.status(400).send('El correo electrónico es requerido'); // Validar que emailCliente no sea vacío
  }

  const mailOptions = {
    from: user, // Correo de origen
    to: emailCliente, // Correo de destino
    subject: 'Encuesta de satisfacción', // Asunto del correo
    html: `
      <h1>Gracias por tu compra</h1>
      <p>Nos gustaría saber tu opinión sobre tu experiencia. Por favor, completa nuestra <a href="https://forms.gle/GxvgrCxNeoaugJCo7" target="_blank">encuesta de satisfacción</a>.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error); // Mostrar error en la consola
      return res.status(500).send('Error al enviar el correo'); // Responder con error 500
    }
    console.log('Correo enviado:', info.response); // Mostrar respuesta del envío
    res.status(200).send('Correo enviado con éxito'); // Responder con éxito
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Usuario:', user); // Imprimir el usuario
  // Evita imprimir la contraseña en entornos de producción
});
