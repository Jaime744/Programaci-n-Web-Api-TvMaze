import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './navBar.jsx'

function App() {
    const handleSearch = async (query) => {
    const apiRes = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    if (!apiRes.ok) {
      throw new Error('Failed to fetch data from TV Maze API');
    }
    const data = await apiRes.json();
    console.log(data);
    if(data.length > 0){
      alert("Busqueda exitosa");
    } else {
      alert("No se encontraron resultados"); 
    } 
    }; 
  return (
    <div className="App">
      <NavBar onSearch={handleSearch}/>
    </div>
  )
}

export default App
