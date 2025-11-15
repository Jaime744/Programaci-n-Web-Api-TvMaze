import { useState,useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './navBar.jsx'


function App() {
    const [results, setResults] = useState([])        
    const [selectedShow, setSelectedShow] = useState(null)

    //const[FavList,setFavList]= useState ([]);
     const favDialog = useRef(null);
     const showInfoDialog = useRef(null);
     // guardado en local storage 
    const [FavList, setFavList] = useState(() => {
    const stored = localStorage.getItem("FavList");
    return stored ? JSON.parse(stored) : [];
    });

     useEffect(()=>{
      localStorage.setItem("FavList",JSON.stringify(FavList));
     },[FavList])

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
  const openShowInfo =(show)=>{
    setSelectedShow(show)
    showInfoDialog.current.showModal();
  }
//<p dangerouslySetInnerHTML={{__html: show.summary}}></p>
    const handleCloseModal = () => {
      setSelectedShow(null);
      showInfoDialog.current.close();
    }
  return (
    <div className="App">
      <NavBar onSearch={handleSearch}
      onToggleList={handleToggleList}
       hasFavorites={FavList.length > 0}
      />
      
      <div className='results-container'>
        {results.map(show => (
            <div key={show.id} className='show-card'>
                <h2>{show.name}</h2>
                {show.image && <img src={show.image.medium} onClick={() => openShowInfo(show)} alt={show.name} />}
            </div>
        ))}
      </div>

    <dialog ref={favDialog} className="fav-dialog">
      <h2>Favoritos</h2>
      {FavList.length === 0 ? (
        <p>No hay favoritos</p>
      ) : (
        <div className='Fav-Container'>
        {FavList.map(show => (
          <div key={show.id} className="fav-card">
            <h3>{show.name}</h3>
            {show.image && <img src={show.image.medium} alt={show.name} />}
            <br></br>
            <button onClick={() => removeFromFavList(show.id)}>Quitar</button>
          </div>
        ))}
        </div>
      )}
      <button className="close-btn" onClick={() => favDialog.current.close()}>Cerrar</button>
    </dialog>

      <dialog ref={showInfoDialog} className='InfoSeries'>
        {selectedShow && (
        <>
        <h2>Información de {selectedShow.name}</h2>
        
        {selectedShow.image && (
          <img src={selectedShow.image.medium} alt={selectedShow.name} className='InfoImage'/>
        )}
        <p dangerouslySetInnerHTML={{__html: selectedShow.summary}}></p>
        <button onClick={() => addToFavList(selectedShow)}>Agregar a Favoritos</button>
        <button onClick={handleCloseModal }>Cerrar</button>
        </>
        )}
      </dialog>

  </div>
  )
  
}

export default App
