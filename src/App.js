import React, { Component } from 'react'
import './App.css'

const porPrecio = (a, b) => a.tarifas[0].importe - b.tarifas[0].importe
const porDias = (a, b) => a.duracionNum - b.duracionNum

class App extends Component {
  state = {
    loaded: false,
    filtro: 'precio',
    list: []
  }

  componentWillMount () {
    fetch('https://www.interturis.com.ar/site/static/json/lista_paquetes.json')
      .then(result => result.json())
      .then(result => {
        this.setState({
          list: result,
          loaded: true
        })
      })
  }

  render () {
    const filteredResults = this.state.list
      // Sale de BA
      .filter(item => item.salidaOrigen && item.salidaOrigen.id === 1)
      // Convierte dolar a pesos a 16.50
      .map(item => item.tarifas[0].moneda.id === 2 ? {
        ...item,
        tarifas: [
          {
            ...item.tarifas[0],
            moneda: {
              simbolo: '$'
            },
            importe: item.tarifas[0].importe * 16.5
          }
        ]
      } : item)
      // Orderna por precio
      .sort(this.state.filtro === 'precio' ? porPrecio : porDias)

    console.log(filteredResults)

    return (
      <div className="App">
        <div className="App-header">
          <h2>Interturis</h2>
        </div>
        <div>
          <div className="App-filtros">
            <button onClick={() => this.setState({filtro: 'precio'})}>Filtrar por precio</button>
            <button onClick={() => this.setState({filtro: 'dias'})}>Filtrar por dias</button>
          </div>
          {filteredResults
            .map((item, index) => (
              <div className="App-item" key={index}>
                <h2>
                  {item.destinos && item.destinos
                  .map((destino, indexDestino) => (
                    <p key={indexDestino}>{destino.nombre}</p>
                  ))}
                </h2>
                <p><strong>{item.duracion}</strong></p>
                <p>{item.detalles}</p>
                <h3>{item.tarifas[0].moneda.simbolo + ' ' + item.tarifas[0].importe}</h3>
                <h5>link: <a target="_blank" href={`https://www.interturis.com.ar/site/static/paquetes-resultado-de-busqueda.html?id=${item.id}`}>https://www.interturis.com.ar/site/static/paquetes-resultado-de-busqueda.html?id={item.id}</a></h5>
                <hr/>
              </div>
            ))}
        </div>
      </div>
    )
  }
}

export default App;
