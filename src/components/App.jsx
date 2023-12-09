import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header.js";
import Main from "./Main";
import Footer from "./Footer.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/api.js";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { currentUserContext } from "../contexts/CurrentUserContext.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login.js";
import Register from "./Register.js";
import { authApi } from "../utils/auth.js";
import InfoTooltip from "./InfoToolTip.js";
import complete from '../images/Complete.svg';
import error from '../images/Error.svg';
function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [userMail, setUserMail] = useState('');
 

  const [statusRegisterPopup, setStatusRegisterPopup] = useState(false);
  const [avatarStatusRegisterPopup, setAvatarStatusRegisterPopup] = useState(null);
  const [textStatusRegisterPopup, setTextStatusRegisterPopup] = useState('');

  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

function handleLogin (email, password) {
  setLoggedIn(true);
  authApi.authorize(email, password)
  .then((res) => {
   if(res){
    localStorage.setItem('jwt', res.token);
    setUserMail(email)
    setLoggedIn(true);
    navigate("/", {replace: true});
   }
  })
  .catch((err) => {
    console.log(err)
    setStatusRegisterPopup(true);
    setTextStatusRegisterPopup('Что-то пошло не так! Попробуйте ещё раз.');
    setAvatarStatusRegisterPopup(error);
  })
}

const exit = () => {
  localStorage.removeItem('jwt');
  setUserMail('');
  navigate("/sign-in", {replace: true});
}

function handleCheckToken ()  {
  if (localStorage.getItem('jwt')) {
    const jwt = localStorage.getItem('jwt');
    authApi.checkToken(jwt)
    .then((res) => {
      setUserMail(res.data.email)
      setLoggedIn(true)
      navigate('/', {replace: true});
    })
    .catch((err) => {
      console.log(err);
    })
  }
}
useEffect(() => {
  handleCheckToken()
})
  

function handleRegistration(email, password){
authApi.registration(email, password)
.then(() => {
  setTextStatusRegisterPopup('Вы успешно зарегистрировались!');
  setStatusRegisterPopup(true);
  setAvatarStatusRegisterPopup(complete);
  navigate("/sign-in", {replace: true});

})
.catch((err) => {
console.log(err)
setStatusRegisterPopup(true);
setTextStatusRegisterPopup('Что-то пошло не так! Попробуйте ещё раз.');
setAvatarStatusRegisterPopup(error);
})
}

  useEffect(() => {
    api.getAllCards()
      .then((cardsInfo) => {
        setCards(cardsInfo);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api.getUserApi()
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
  
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setStatusRegisterPopup(false)
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item._id === currentUser._id);
    const checkLike = isLiked ? api.deleteLike(card._id) : api.setLike(card._id);
    checkLike.then((newCard) => {
      const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
      setCards(newCards);
    });
  }
  function handleCardDelete(card) {
    console.log("delte");
    api.deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(data) {
    api.setUserApi(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(data) {
    api.setUserAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlace(data) {
    api.createCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      
  }
  
  return (
    <currentUserContext.Provider value={currentUser}>
     
     <Header mail={userMail} exit = {exit}/>
    
     <>
<Routes>
<Route path="/" element={
              <ProtectedRoute
              element={Main}
              loggedIn={loggedIn}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
                
              
              />
            } />
<Route path="/sign-in" element={<Login  handleLogin={handleLogin}/>}/>
<Route path="/sign-up" element={<Register handleRegister={handleRegistration} />}/>
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
        <InfoTooltip
    isOpen={statusRegisterPopup}
    onClose={closeAllPopups}
    logo={avatarStatusRegisterPopup}
    name={textStatusRegisterPopup}
  />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
 
    </currentUserContext.Provider>
  );
}

export default App;