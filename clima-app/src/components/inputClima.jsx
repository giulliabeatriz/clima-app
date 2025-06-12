import React from 'react';

export default function InputClima({ cidade, setCidade, buscarClima, sugestoes, setSugestoes, focado, setFocado }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); buscarClima(); }}>
      <div className='input-group'>
        <input id="input-clima"
          className='form-control'
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          onFocus={() => setFocado(true)}
          onBlur={() => setTimeout(() => setFocado(false), 150)}
          placeholder="Digite a cidade"
        />
        <button className="btn btn-outline-secondary" type="submit">Buscar</button>
      </div>

      {focado && sugestoes?.length > 0 && (
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
    </form>
  );
}
