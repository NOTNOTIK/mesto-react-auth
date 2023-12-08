import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Header.js";
import Main from "./Main.jsx";
import Footer from "./Footer.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup.js";
import Register from "./Register";
import Login from "./Login";
import api from "../utils/api.js";
import { currentUserContext } from "../contexts/CurrentUserContext.js";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  React.useEffect(() => {
    api
      .getAllCards()
      .then((cardsInfo) => {
        setCards(cardsInfo);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    api
      .getUserApi()
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  /* function handleCardDelete(card) {
    setSelectedCard(card);
  }*/
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item._id === currentUser._id);
    const checkLike = isLiked
      ? api.deleteLike(card._id)
      : api.setLike(card._id);
    checkLike.then((newCard) => {
      const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
      setCards(newCards);
    });
  }
  function handleCardDelete(card) {
    console.log("delte");
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(data) {
    api
      .setUserApi(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(data) {
    api
      .setUserAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlace(data) {
    api
      .createCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="page">

    <currentUserContext.Provider value={currentUser}>
      <>
      <Header />

      <Routes>
    
{/*
      <ProtectedRoute
      loggedIn={loggedIn}
      element={Main} 
      onEditProfile = {handleEditProfileClick}
      onAddPlace = {handleAddPlaceClick}
      onEditAvatar = {handleEditAvatarClick}
      onCardClick = {handleCardClick}
      onCardLike = {handleCardLike}
      onCardDelete = {handleCardDelete}
      cards={cards}
      
      />*/
    } 


<Route path="/" element={
      <ProtectedRoute
      loggedIn={loggedIn}
      element={Main} 
      onEditProfile = {handleEditProfileClick}
      onAddPlace = {handleAddPlaceClick}
      onEditAvatar = {handleEditAvatarClick}
      onCardClick = {handleCardClick}
      onCardLike = {handleCardLike}
      onCardDelete = {handleCardDelete}
      cards={cards}
      currentUser={currentUser}
      
      />
    } />
   <Route path="/sign-in" element={<Login handleLogin={handleLogin}  />} />
    
    <Route path="/sign-up" element={<Register/>} />
    </Routes>
    </>
        <Footer />
       
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
     
    </currentUserContext.Provider>
    </div>
  );
};

export default App;
