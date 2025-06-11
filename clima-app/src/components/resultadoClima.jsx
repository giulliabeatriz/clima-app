import React from 'react';

export default function ResultadoClima({ dados }) {
  if (!dados) return null;

  return (
    <section className="mt-3">
      <h2 className='display-6'>{dados.name}</h2>
      <p className='lead mb-1'>🌡️ {dados.main.temp} °C</p>
      <p className='lead mb-1'>☁️ {dados.weather[0].description}</p>
      <p className='lead mb-0'>💧 Umidade: {dados.main.humidity}%</p>
    </section>
  );
}
