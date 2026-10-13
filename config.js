// ============================================================
// CONFIGURACIÓN DE LA ENCUESTA
// Los IDs de "entry" corresponden al Google Form original, por lo que
// cada respuesta enviada desde esta web llega a la misma hoja de respuestas.
// ============================================================
window.SURVEY_CONFIG = {
  // ID público del Google Form (parte de la URL .../forms/d/e/<ID>/viewform)
  formId: '1FAIpQLSf6mf_zNMUmfGVy_3m7Ve_CELVUM-6ORapJgcvcxxj1aknyjA',

  // Formulario SEPARADO del sorteo (Google Form "Sorteo gift card S/ 300 – Encuesta dólares").
  // Los datos de contacto van a otra hoja, así las respuestas de la encuesta siguen siendo anónimas.
  // Para ocultar el registro del sorteo, cambia formId a ''.
  sorteo: {
    formId: '1FAIpQLSfDXcw0-W4y3ofyI54DRqXp2kgzyAZ0Qzvsau8JPMz4lWYnVA',
    nombre: '1068608542',
    correo: '2033849936',
    celular: '976110091',
    acepto: { entry: '1155403461', value: 'Acepto' }
  },

  // ID del Pixel de Meta (opcional). Si lo completas, se registra un evento "Lead"
  // cuando alguien termina la encuesta, útil para optimizar la pauta en Instagram.
  metaPixelId: '',

  premio: 'S/ 300',

  filtro: { entry: '605675578', si: 'Si', no: 'No' },

  residencia: {
    entry: '1953489616',
    // value = texto exacto de la opción en Google Forms; label = texto que se muestra
    opciones: [
      { value: 'Barranco', label: 'Barranco' },
      { value: 'Jesús María', label: 'Jesús María' },
      { value: 'La Molina', label: 'La Molina' },
      { value: 'Lince', label: 'Lince' },
      { value: 'Magdalena', label: 'Magdalena del Mar' },
      { value: 'Miraflores', label: 'Miraflores' },
      { value: 'Pueblo Libre', label: 'Pueblo Libre' },
      { value: 'San Borja', label: 'San Borja' },
      { value: 'San Isidro', label: 'San Isidro' },
      { value: 'San Miguel', label: 'San Miguel' },
      { value: 'Surco', label: 'Santiago de Surco' },
      { value: 'Surquillo', label: 'Surquillo' }
    ],
    otro: 'Otro'
  },

  sexo: {
    entry: '513689989',
    opciones: ['Femenino', 'Masculino', 'Prefiero no decirlo'],
    otroLabel: 'Otro'
  },

  edad: { entry: '397310085', min: 30, max: 45, otro: 'Otro' },

  // 28 ítems validados (mismo orden y redacción que el instrumento validado por juicio de expertos)
  items: [
    { entry: '612909736', text: "Considero que el uso de plataformas online para cambiar dólares es útil en mi vida diaria." },
    { entry: '354464443', text: "Usar plataformas online para cambiar dólares aumenta mis posibilidades de lograr cosas importantes para mí." },
    { entry: '1658038834', text: "Usar plataformas online para cambiar dólares me ayuda a realizar las transacciones más rápido." },
    { entry: '1533530932', text: "Usar plataformas online para cambiar dólares aumenta mi productividad." },
    { entry: '1325136304', text: "Aprender a usar plataformas online para cambiar dólares es fácil para mí." },
    { entry: '1449637072', text: "Mi interacción con las plataformas online para cambiar dólares es clara y comprensible." },
    { entry: '1135684259', text: "Considero que las plataformas online para cambiar dólares son fáciles de usar." },
    { entry: '1293754354', text: "Es fácil para mí volverme hábil en el uso de plataformas online para cambiar dólares." },
    { entry: '136041499', text: "Las personas que son importantes para mí piensan que debería usar plataformas online para cambiar dólares." },
    { entry: '662611353', text: "Las personas que influyen en mi comportamiento creen que debería usar plataformas online para cambiar dólares." },
    { entry: '1179356614', text: "Las personas cuyas opiniones valoro prefieren que use plataformas online para cambiar dólares." },
    { entry: '136031036', text: "Tengo los recursos necesarios para usar plataformas online para cambiar dólares." },
    { entry: '1368380298', text: "Tengo los conocimientos necesarios para usar plataformas online para cambiar dólares." },
    { entry: '467770151', text: "Las plataformas online para cambiar dólares son compatibles con otras tecnologías que uso." },
    { entry: '1824608952', text: "Puedo obtener ayuda de otros cuando tengo dificultades para usar plataformas online para cambiar dólares." },
    { entry: '441737470', text: "Usar plataformas online para cambiar dólares es divertido." },
    { entry: '1359459552', text: "Usar plataformas online para cambiar dólares es agradable." },
    { entry: '1428466895', text: "Usar plataformas online para cambiar dólares es muy entretenido." },
    { entry: '574696784', text: "Las plataformas online para cambiar dólares tienen un precio razonable." },
    { entry: '33019674', text: "Las plataformas online para cambiar dólares ofrecen una buena relación calidad-precio." },
    { entry: '2101578288', text: "Al precio actual, las plataformas online para cambiar dólares proporcionan un buen valor." },
    { entry: '406326096', text: "El uso de plataformas online para cambiar dólares se ha convertido en un hábito para mí." },
    { entry: '604065323', text: "Soy leal a usar plataformas online para cambiar dólares." },
    { entry: '786966978', text: "Debo usar plataformas online para cambiar dólares." },
    { entry: '990070403', text: "Usar plataformas online para cambiar dólares se ha vuelto natural para mí." },
    { entry: '1735508487', text: "Tengo la intención de seguir usando plataformas online para cambiar dólares en el futuro." },
    { entry: '947331860', text: "Siempre trataré de usar plataformas online para cambiar dólares en mi vida diaria." },
    { entry: '1792662872', text: "Planeo seguir usando plataformas online para cambiar dólares con frecuencia." }
  ]
};
