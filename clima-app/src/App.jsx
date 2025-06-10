import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [cidade, setCidade] = useState('');
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);

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
    if (!resp.ok) throw new Error('Cidade não encontrada! Verifique se o nome foi digitado corretamente');
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
    }, 500);

    return () => clearTimeout(timeout);
  }, [cidade]);

  const selecionarCidade = (nome) => {
    setCidade(nome);
    setSugestoes([]);
  };

  return (
    <main className="app card">
      <div className="column">
        <h1>🌤️ Weather App!</h1>
      <p>Descubra o clima da cidade agora!</p>
      </div>

      <form onSubmit={buscarClima}>
        <div className='input-group'>
          <input className='form-control'
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          placeholder="Digite a cidade"
        />
        <button className="btn btn-outline-secondary" type="submit">Buscar</button>
        { sugestoes?.length > 0 && (
          <ul className="lista-sugestoes">
            {sugestoes.map((sugestao) => (
                            <li
                key={sugestao.id}
                onClick={() => {
                  setCidade(sugestao.name); 
                  setSugestoes([]); 
                  buscarClima(sugestao.name); 
                }}
              >
                {sugestao.name}, {sugestao.region}, {sugestao.country}
              </li>
            ))}
          </ul>
        )}
        </div>        
      </form>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="erro">{erro}</p>}

      {dados && (
        <section className="mt-3">
          <h2>{dados.name}</h2>
          <p>🌡️ {dados.main.temp} °C</p>
          <p>☁️ {dados.weather[0].description}</p>
          <p>💧 Umidade: {dados.main.humidity}%</p>
        </section>
      )}
    </main>
  );
}
