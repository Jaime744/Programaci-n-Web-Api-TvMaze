import { useState,useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './navBar.jsx'


function App() {
    const [results, setResults] = useState([])        
    const [selectedShow, setSelectedShow] = useState(null)

    const[FavList,setFavList]= useState ([]);
     const favDialog = useRef(null);

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
    
    const addToFavList = (show) => {
      if (!FavList.find(favShow => favShow.id === show.id)) {
        setFavList([...FavList, show]);
      }
    }
    const removeFromFavList = (showId) => {
      setFavList(FavList.filter(show => show.id !== showId));
    }
    const handleToggleList = () => {
    if (favDialog.current.open) {
      favDialog.current.close();
    } else {
      favDialog.current.showModal();
    }
  };

    const handleCloseModal = () => setSelectedShow(null);
  return (
    <div className="App">
      <NavBar onSearch={handleSearch}
      onToggleList={handleToggleList}
      />
      
      <div className='results-container'>
        {results.map(show => (
            <div key={show.id} className='show-card'>
                <h2>{show.name}</h2>
                {show.image && <img src={show.image.medium} alt={show.name} />}
                <p dangerouslySetInnerHTML={{__html: show.summary}}></p>
                <button onClick={() => addToFavList(show)}>Agregar a Favoritos</button>
            </div>
        ))}
      </div>

    <dialog ref={favDialog} className="fav-dialog">
      <h2>Favoritos</h2>

      {FavList.length === 0 ? (
        <p>No hay favoritos</p>
      ) : (
        FavList.map(show => (
          <div key={show.id} className="fav-card">
            <h3>{show.name}</h3>
            {show.image && <img src={show.image.medium} alt={show.name} />}
            <button onClick={() => removeFromFavList(show.id)}>Quitar</button>
          </div>
        ))
      )}
      <button className="close-btn" onClick={() => favDialog.current.close()}>Cerrar</button>
    </dialog>
  </div>
  )
  
}

export default App
