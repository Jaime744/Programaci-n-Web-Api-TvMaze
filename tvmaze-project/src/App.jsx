import { useState,useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './navBar.jsx'


function App() {
  //
    const [results, setResults] = useState([])        
    const [selectedShow, setSelectedShow] = useState(null)
    
    //const[FavList,setFavList]= useState ([]);
     const favDialog = useRef(null);
     const showInfoDialog = useRef(null);

     
     //Guardado en local storage 
    const [FavList, setFavList] = useState(() => {
    const stored = localStorage.getItem("FavList");
    return stored ? JSON.parse(stored) : [];
    });
     useEffect(()=>{
      localStorage.setItem("FavList",JSON.stringify(FavList));
     },[FavList])


     // añade quita y maneja la lista de favoritos 
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

     // botón de favoritos con el icono de estrella 
     const isFavorite = selectedShow && FavList.some(favShow => favShow.id === selectedShow.id);

    //para volver a pulsar el boton y que se quite de favoritos 
     const toggleFavorite =(selectedShow)=>{
      if(FavList.some(favShow => favShow.id === selectedShow.id)){
        removeFromFavList(selectedShow.id);
      }else{
        addToFavList(selectedShow);
      }
     }

     // función que maneja las busquedas 
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
    
  // función que abre la info de la sere
  const openShowInfo =(show)=>{
    setSelectedShow(show)
    showInfoDialog.current.showModal();
  }
    //funcion que cierra la informacion y limpia el modal 
    const handleCloseModal = () => {
      setSelectedShow(null);
      showInfoDialog.current.close();
    }
  return (
    
    <div className="App">
      {/* Barra de navegación pasa los handlers y estado derivado */}
      <NavBar onSearch={handleSearch}
      onToggleList={handleToggleList}
       hasFavorites={FavList.length > 0}
      />
      {/* resultado que devuelve la api ante la busqueda que el hemos pasado */}
      <div className='results-container'>
        {results.map(show => (
            <div key={show.id} className='show-card'>
                <h2>{show.name}</h2>
                {show.image && <img src={show.image.medium} onClick={() => openShowInfo(show)} alt={show.name} />}
            </div>
        ))}
      </div>
      {/* dialog de Favoritos */}
    <dialog ref={favDialog} className="fav-dialog">
      <h2>Favoritos</h2>
      {FavList.length === 0 ? (
        <p>No hay favoritos</p>
      ) : (
        <div className='Fav-Container'>
        {FavList.map(show => (
          <div key={show.id} className="fav-card">
            <h3>{show.name}</h3>
            {show.image && <img src={show.image.medium} alt={show.name} onClick={() => openShowInfo(show)} />}
            <br></br>
            <button onClick={() => removeFromFavList(show.id)}>Quitar</button>
          </div>
        ))}
        </div>
      )}
      <button className="close-btn" onClick={() => favDialog.current.close()}>Cerrar</button>
    </dialog>
      {/* dialog de la info de la serie  */}
      <dialog ref={showInfoDialog} className='InfoSeries'>
        {selectedShow && (
        <>
        <h2>{selectedShow.name}</h2>
        
        {selectedShow.image && (
          <img src={selectedShow.image.medium} alt={selectedShow.name} onClick={() => openShowInfo(show)} className='InfoImage'/>
        )}
        <p dangerouslySetInnerHTML={{__html: selectedShow.summary}}></p>
        <button onClick={() => toggleFavorite(selectedShow)} className={`star-icon ${isFavorite ? 'filled' : 'empty'}`}>★</button> 
        <button onClick={handleCloseModal }>Cerrar</button>
        </>
        )}
      </dialog>

  </div>
  )
  
}

export default App
