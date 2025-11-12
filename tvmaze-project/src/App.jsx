import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './navBar.jsx'

function App() {
    const [results, setResults] = useState([])        
    const [selectedShow, setSelectedShow] = useState(null)
    const handleSearch = async (query) => {
    const apiRes = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
        if (!apiRes.ok) {
        throw new Error('Error al buscar la api');
        }
        try{
            const data = await apiRes.json();
            console.log(data);
            setResults(data.map(item => item.show));
        }catch(error){
            console.error('Error en respuesta de la API', error);
        };
    }  
    const handleCloseModal = () => setSelectedShow(null);
  return (
    <div className="App">
      <NavBar onSearch={handleSearch}/>
      <div className='results-container'>
        {results.map(show => (
            <div key={show.id} className='show-card'>
                <h2>{show.name}</h2>
                {show.image && <img src={show.image.medium} alt={show.name} />}
                <p dangerouslySetInnerHTML={{__html: show.summary}}></p>
            </div>
        ))}
      </div>
    </div>
  )
}

export default App
