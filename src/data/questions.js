export const questions = {
  fase1: [
    { id: 1, text: "Cuando algo se daña, intento revisarlo o arreglarlo.", pesos: { R: 1 }},
    { id: 2, text: "Prefiero usar herramientas antes que solo leer o escuchar.", pesos: { R: 1 }},
    { id: 3, text: "Busco información hasta entender un tema completamente.", pesos: { I: 1 }},
    { id: 4, text: "Disfruto resolver problemas que requieren varios pasos.", pesos: { I: 1 }},
    { id: 5, text: "Intento dar estilo propio a mis trabajos.", pesos: { A: 1 }},
    { id: 6, text: "Creo contenido por iniciativa propia (dibujos, videos, textos).", pesos: { A: 1 }},
    { id: 7, text: "Explico temas a compañeros cuando no entienden.", pesos: { S: 1 }},
    { id: 8, text: "Procuro que todos participen en trabajos grupales.", pesos: { S: 1 }},
    { id: 9, text: "Tomo iniciativa para organizar actividades.", pesos: { E: 1 }},
    { id: 10, text: "Me siento cómodo tomando decisiones importantes.", pesos: { E: 1 }},
    { id: 11, text: "Organizo tareas con listas o métodos.", pesos: { C: 1 }},
    { id: 12, text: "Sigo instrucciones paso a paso sin omitir detalles", pesos: { C: 1 }},
    
  ],

  fase2: {
    R: [
      { text: "Intento reparar objetos antes de reemplazarlos.", pesos: { R: 1 }},
      { text: "Me interesa cómo funcionan los objetos por dentro.", pesos: { R: 1 }},
      { text: "Prefiero actividades prácticas a leer teoría.", pesos: { R: 1 }},
      { text: "Disfruto tareas con resultados visibles.", pesos: { R: 1 }},
      { text: "Prefiero trabajar con objetos que ideas abstractas.", pesos: { R: 1 }},
      { text: "He armado o desarmado cosas por iniciativa propia.", pesos: { R: 1 }},
      { text: "Aprendo mejor haciendo que escuchando.", pesos: { R: 1 }},
    ],
    I: [
      { text: "Busco causas antes de solucionar problemas.", pesos: { I: 1 }},
      { text: "Comparo diferentes soluciones para un problema.", pesos: { I: 1 }},
      { text: "Disfruto analizar información o patrones.", pesos: { I: 1 }},
      { text: "Hago preguntas para entender mejor los temas.", pesos: { I: 1 }},
      { text: "Prefiero pensar antes que actuar rápidamente.", pesos: { I: 1 }},
      { text: "Me interesan temas complejos.", pesos: { I: 1 }},
      { text: "Identifico errores cuando algo falla.", pesos: { I: 1 }},
    ],
    A: [
      { text: "Modifico trabajos para hacerlos más originales.", pesos: { A: 1 }},
      { text: "Prefiero tareas sin reglas estrictas.", pesos: { A: 1 }},
      { text: "Me gusta combinar colores o estilos.", pesos: { A: 1 }},
      { text: "Prefiero crear en lugar de repetir instrucciones.", pesos: { A: 1 }},
      { text: "Me gustan tareas sin única respuesta correcta.", pesos: { A: 1 }},
      { text: "Experimento nuevas formas de hacer cosas.", pesos: { A: 1 }},
      { text: "Busco que mi trabajo tenga estilo propio.", pesos: { A: 1 }},
    ],
    S: [
      { text: "Intento entender emociones antes de responder.", pesos: { S: 1 }},
      { text: "Disfruto interactuar con otras personas.", pesos: { S: 1 }},
      { text: "Me siento cómodo explicando temas.", pesos: { S: 1 }},
      { text: "Prefiero trabajar en equipo.", pesos: { S: 1 }},
      { text: "Me gusta ayudar a mejorar a otros.", pesos: { S: 1 }},
      { text: "Ofrezco ayuda sin que me la pidan.", pesos: { S: 1 }},
      { text: "Me gusta que mi trabajo ayude a otros.", pesos: { S: 1 }},
    ],
    E: [
      { text: "Propongo planes cuando el grupo está desorganizado.", pesos: { E: 1 }},
      { text: "Intento influir en decisiones del grupo.", pesos: { E: 1 }},
      { text: "Hablo con seguridad frente a varias personas.", pesos: { E: 1 }},
      { text: "Asumo responsabilidades que otros evitan.", pesos: { E: 1 }},
      { text: "Tomo decisiones con información incompleta.", pesos: { E: 1 }},
      { text: "Intento convencer a otros de mis ideas.", pesos: { E: 1 }},
      { text: "Me interesa iniciar proyectos nuevos.", pesos: { E: 1 }},
    ],
    C: [
      { text: "Reviso detalles para evitar errores.", pesos: { C: 1 }},
      { text: "Mantengo la información organizada.", pesos: { C: 1 }},
      { text: "Prefiero tareas con instrucciones claras.", pesos: { C: 1 }},
      { text: "Sigo procesos paso a paso.", pesos: { C: 1 }},
      { text: "Reviso detalles para evitar errores.", pesos: { C: 1 }},
      { text: "Prefiero estructura antes que improvisación.", pesos: { C: 1 }},
      { text: "Uso listas o registros para trabajar.", pesos: { C: 1 }},
      { text: "Me siento cómodo con reglas claras.", pesos: { C: 1 }},
    ]
  },

  fase3: [
    {
      text: "¿Qué prefieres hacer?",
      options: [
        { text: "Construir algo", pesos: { R: 2 }},
        { text: "Analizar datos", pesos: { I: 2 }},
        { text: "Diseñar algo", pesos: { A: 2 }},
        { text: "Ayudar a alguien", pesos: { S: 2 }},
        { text: "Liderar", pesos: { E: 2 }},
        { text: "Organizar", pesos: { C: 2 }},
      ]
    }
  ]
};