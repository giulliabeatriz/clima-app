import React from 'react';

export default function AlertaErro({ erro, carregando }) {
  if (carregando) return <p className='mt-3'>Carregando...</p>;

  if (erro) {
    return (
      <div>
        <p className="erro h5 mt-3 mb-1 bg-danger text-light rounded p-2">{erro}</p>
        <span className='lead'>Verifique se o nome da cidade foi digitado corretamente</span>
      </div>
    );
  }

  return null;
}
