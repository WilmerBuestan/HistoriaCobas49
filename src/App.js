import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import stringSimilarity from 'string-similarity';
import confetti from 'canvas-confetti';

const materias = [
  "GUERRA DE VIETNAM",
  "GUERRA DEL CENEPA",
  "GUERRA DEL GOLFO PÉRSICO",
  "GUERRA DE COREA",
  "GUERRA POR LAS MALVINAS",
  "DERECHO INTERNACIONAL HUMANITARIO"
];

export default function App() {
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [verificadas, setVerificadas] = useState([]);

  useEffect(() => {
    if (materiaSeleccionada) {
      const nombreArchivo = materiaSeleccionada.toLowerCase().includes("vietnam")
        ? "vietnam.json"
        : materiaSeleccionada.toLowerCase().includes("cenepa")
        ? "cenepa.json"
        : materiaSeleccionada.toLowerCase().includes("golfo")
        ? "golfo.json"
        : materiaSeleccionada.toLowerCase().includes("corea")
        ? "corea.json"
        : materiaSeleccionada.toLowerCase().includes("malvinas")
        ? "malvinas.json"
        : "dih.json";

      fetch(`/${nombreArchivo}`)
        .then(res => res.json())
        .then(data => {
          setPreguntas(data);
          setRespuestas(Array(data.length).fill(""));
          setVerificadas(Array(data.length).fill(null));
        })
        .catch(() => {
          setPreguntas([]);
          setRespuestas([]);
          setVerificadas([]);
        });
    }
  }, [materiaSeleccionada]);

  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
        <div className="card p-5 shadow w-100" style={{ maxWidth: 700 }}>
          <h1 className="text-center mb-4">Cuestionarios Militares</h1>

          {!materiaSeleccionada ? (
            <div className="d-grid gap-3">
              {materias.map((materia, i) => (
                <button
                  key={i}
                  className="btn btn-primary btn-lg"
                  onClick={() => setMateriaSeleccionada(materia)}
                >
                  {materia}
                </button>
              ))}
            </div>
          ) : (
            <Cuestionario
              materia={materiaSeleccionada}
              preguntas={preguntas}
              respuestas={respuestas}
              setRespuestas={setRespuestas}
              verificadas={verificadas}
              setVerificadas={setVerificadas}
              volver={() => setMateriaSeleccionada(null)}
            />
          )}
        </div>
      </div>

      <div className="text-center text-muted small mt-4 mb-3">
        <hr />
        <p>POWERED BY: <strong>THEGRANWIL</strong> ⚔️</p>
      </div>
    </>
  );
}

function Cuestionario({ materia, preguntas, respuestas, setRespuestas, verificadas, setVerificadas, volver }) {
  const [mostrarNota, setMostrarNota] = useState(false);
  const [nota, setNota] = useState(0);

  const reiniciarRespuestas = () => {
    setRespuestas(Array(preguntas.length).fill(""));
    setVerificadas(Array(preguntas.length).fill(null));
    setMostrarNota(false);
    setNota(0);
  };

  const verificarUna = (i) => {
    const entrada = respuestas[i].trim().toLowerCase();
    const solucion = preguntas[i].respuesta.trim().toLowerCase();
    const similitud = stringSimilarity.compareTwoStrings(entrada, solucion);
    const esCorrecta = similitud >= 0.5;

    const nuevas = [...verificadas];
    nuevas[i] = { estado: esCorrecta, similitud };
    setVerificadas(nuevas);
  };

  const calificar = () => {
    const correctas = verificadas.filter(v => v?.estado === true).length;
    const total = preguntas.length;
    const notaFinal = Math.round((correctas / total) * 20);
    setNota(notaFinal);
    setMostrarNota(true);
  
    if (notaFinal === 20) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  
  
  
  
  };

  if (!preguntas || preguntas.length === 0) {
    return <div className="text-center text-muted">Cargando preguntas...</div>;
  }

  return (
    <div>
      <h2 className="text-center text-primary mb-4">{materia}</h2>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-warning btn-sm" onClick={reiniciarRespuestas}>
          🔁 Reiniciar respuestas
        </button>
      </div>

      {preguntas.map((pregunta, i) => (
        <div
          key={i}
          className={`mb-4 p-3 border rounded shadow-sm transition ${
            verificadas[i] === null
              ? "border-secondary"
              : verificadas[i]?.estado
              ? "border-success bg-light"
              : "border-danger bg-light"
          }`}
        >
          <p className="fw-bold">{pregunta.pregunta}</p>

          <input
            type="text"
            className="form-control mb-2"
            value={respuestas[i]}
            onChange={(e) => {
              const nuevas = [...respuestas];
              nuevas[i] = e.target.value;
              setRespuestas(nuevas);
            }}
            disabled={verificadas[i] !== null}
          />

          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => verificarUna(i)}
              disabled={verificadas[i] !== null}
            >
              Verificar
            </button>

            {verificadas[i] !== null && (
              <div className={`ms-3 fade-in ${verificadas[i].estado ? "text-success" : "text-danger"}`}>
                {verificadas[i].estado ? (
                  verificadas[i].similitud < 0.85 ? (
                    <div>
                      ✅ ¡Casi perfecto! 👌<br />
                      <small>
                        Similitud: {(verificadas[i].similitud * 100).toFixed(1)}%<br />
                        Respuesta correcta: <strong>{pregunta.respuesta}</strong>
                      </small>
                    </div>
                  ) : (
                    <div>✅ ¡Correcto! 👏 😄</div>
                  )
                ) : (
                  <div>
                    ❌ Incorrecto 😞<br />
                    <small>
                      Similitud: {(verificadas[i].similitud * 100).toFixed(1)}%<br />
                      Respuesta correcta: <strong>{pregunta.respuesta}</strong>
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="text-center mt-4">
        <button className="btn btn-secondary me-3" onClick={volver}>← Volver</button>

        {!mostrarNota && verificadas.every(v => v !== null) && (
          <button className="btn btn-primary" onClick={calificar}>🎯 Calificar</button>
        )}

{mostrarNota && (
  <div className="mt-4 p-4 border rounded bg-light text-center">
    <h3 className="text-dark fw-bold">Tu Nota: {nota}/20</h3>

    {nota === 20 && (
      <div className="text-warning fw-bold mt-2">
        🥇 MEDALLA DE ORO <br />
        ¡EXCELENTE DESEMPEÑO! <br />
        ERES UN LIDER 💯💪🎖️
      </div>
    )}

    {nota >= 17 && nota < 20 && (
      <div className="text-primary fw-bold mt-2">
        🥈 MEDALLA DE PLATA <br />
        ¡MUY BUEN TRABAJO! <br />
        ¡SÓLO UN PASO MÁS PARA SER IMPECABLE! 🚀
      </div>
    )}

    {nota < 17 && (
      <div className="text-danger fw-bold mt-2">
        🗑️ MUY <br />
        EL COBAS ES DEMANDANTE Y NO LO ESTÁS HACIENDO BIEN 😞 <br />
        ¡ENTRENA MÁS, SOLDADO!
      </div>
    )}
  </div>
)}


      </div>
    </div>
  );
}
