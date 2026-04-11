import { useEffect, useState } from "react";
import { getPerfilByUsuario } from "../../services/api";
import RadarPerfil from "../../components/RadarPerfil";
import { getRecomendacionesByUsuario } from "../../services/api";
import CareerRow from "../../components/CareerRow";
import CareerCard from "../../components/CareerCard";

const RASGOS_INFO = {
  R: {
    nombre: "Realista",
    descripcion:
      "Las personas con este perfil disfrutan actividades prácticas y concretas. Suelen sentirse cómodas trabajando con herramientas, maquinaria, tecnología o en entornos físicos. Prefieren ver resultados tangibles de su trabajo y resolver problemas de manera directa.",
  },
  I: {
    nombre: "Investigativo",
    descripcion:
      "Este perfil se caracteriza por el interés en analizar, investigar y comprender cómo funcionan las cosas. Son personas curiosas, reflexivas y orientadas a resolver problemas complejos mediante el pensamiento lógico y científico.",
  },
  A: {
    nombre: "Artístico",
    descripcion:
      "Las personas artísticas valoran la creatividad y la expresión personal. Disfrutan actividades relacionadas con el diseño, la música, la escritura o cualquier forma de expresión libre. Suelen evitar estructuras rígidas y prefieren entornos flexibles.",
  },
  S: {
    nombre: "Social",
    descripcion:
      "Este perfil está orientado al trabajo con personas. Son individuos empáticos, comunicativos y con vocación de servicio. Disfrutan enseñar, ayudar y colaborar, y suelen sentirse motivados al generar impacto positivo en otros.",
  },
  E: {
    nombre: "Emprendedor",
    descripcion:
      "Las personas emprendedoras tienden a asumir roles de liderazgo. Les gusta tomar decisiones, influir en otros y alcanzar objetivos. Son dinámicas, seguras y se sienten cómodas en entornos competitivos o de negocio.",
  },
  C: {
    nombre: "Convencional",
    descripcion:
      "Este perfil se asocia con personas organizadas, estructuradas y detallistas. Disfrutan trabajar con datos, procesos claros y tareas bien definidas. Se sienten cómodas en ambientes donde hay orden, planificación y precisión.",
  },
};

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recomendaciones, setRecomendaciones] = useState(null);

  const id_usuario = 2;

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await getPerfilByUsuario(id_usuario);
        setPerfil(data);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
    const fetchRecomendaciones = async () => {
      try {
        const data = await getRecomendacionesByUsuario(id_usuario);
        setRecomendaciones(data.recomendaciones);
      } catch (error) {
        console.error("Error cargando recomendaciones:", error);
      }
    };
    fetchRecomendaciones();
  }, []);

  if (loading) return <div className="p-6">Cargando perfil...</div>;

  if (!perfil)
    return <div className="p-6 text-red-500">No se pudo cargar el perfil</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      {/* 🔹 RESULTADOS */}
      <div className="bg-gray-100 p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-3">Resultados</h2>

        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(perfil.perfil).map(([key, value]) => (
            <li key={key} className="text-sm">
              <span className="font-semibold text-blue-600">
                {RASGOS_INFO[key].nombre}:
              </span>{" "}
              {value}%
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* 🧠 PODIO */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Tu perfil destacado
          </h2>

          <div className="space-y-3">
            {perfil.top3.map((r, index) => (
              <div
                key={r}
                className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
              >
                <span className="text-lg">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                </span>

                <p className="font-semibold text-blue-600">
                  {RASGOS_INFO[r].nombre}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 📊 GRÁFICA */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Visualización de tu perfil
          </h2>

          <RadarPerfil data={perfil.perfil} />
        </div>
      </div>

      {recomendaciones && (
        <div className="bg-gray-100 p-6 rounded-xl mt-6">

          <h2 className="text-2xl font-bold mb-6">
            Recomendación para ti
          </h2>

          {/* 🎯 PRINCIPAL */}
          <div className="bg-white p-6 rounded-xl shadow mb-6 border-l-4 border-blue-500">
            <h3 className="text-lg text-gray-600 mb-2">
              Opción más alineada con tu perfil
            </h3>

            <p className="text-2xl font-bold text-blue-600">
              {recomendaciones.principal}
            </p>
          </div>

          {/* 🔹 SECUNDARIAS */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Otras opciones que también pueden interesarte
            </h3>

            <div className="flex flex-wrap gap-3">
              {recomendaciones.secundarias.map((carrera, i) => (
                <span
                  key={i}
                  className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm shadow-sm"
                >
                  {carrera}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 🔹 EXPLICACIÓN COMPLETA */}
      <div className="bg-gray-100 p-6 rounded-xl mt-6">
        <h2 className="text-xl font-semibold mb-4">
          ¿Qué significa tu perfil?
        </h2>

        <div className="space-y-4 text-sm text-gray-700">
          {Object.entries(RASGOS_INFO).map(([key, info]) => (
            <div key={key}>
              <p className="font-semibold text-blue-600 mb-1">
                {info.nombre}
              </p>
              <p className="space-y-4 text-sm text-gray-700 text-justify">{info.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}