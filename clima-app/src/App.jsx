import './App.css';
import InputClima from './components/inputClima';
import ResultadoClima from './components/resultadoClima';
import AlertaErro from './components/alertaErro';
import { useState, useEffect } from 'react';

export default function App() {
  const [cidade, setCidade] = useState('');
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  const [focado, setFocado] = useState(false);

  const weatherKey = import.meta.env.VITE_OPENWEATHER_KEY;
  const geoKey = import.meta.env.VITE_RAPIDAPI_KEY;

  async function buscarClima(nomeDaCidade) {
    const cidadeBuscada = nomeDaCidade || cidade;
    if (!cidadeBuscada) return;

    setCarregando(true);
    setErro('');
    setDados(null);

    try {
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cidadeBuscada}&appid=${weatherKey}&units=metric&lang=pt_br`
      );
      if (!resp.ok) throw new Error('Cidade não encontrada!');
      const json = await resp.json();
      setDados(json);
      setSugestoes([]);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (cidade.length < 2) {
      setSugestoes([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${cidade}&limit=5&sort=-population`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': geoKey,
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
        },
      })
        .then((res) => res.json())
        .then((data) => setSugestoes(data.data))
        .catch((err) => console.error(err));
    }, 200);

    return () => clearTimeout(timeout);
  }, [cidade]);

  return (
    <main className="app card p-5">
      <div className="column">
        <h1 className='display-3'>🌤️ Weather App!</h1>
        <p className='lead p-2'>Descubra o clima de uma cidade agora!</p>
      </div>

      <InputClima
        cidade={cidade}
        setCidade={setCidade}
        buscarClima={buscarClima}
        sugestoes={sugestoes}
        setSugestoes={setSugestoes}
        focado={focado}
        setFocado={setFocado}
      />

      <AlertaErro erro={erro} carregando={carregando} />

      <ResultadoClima dados={dados} />
    </main>
  );
}