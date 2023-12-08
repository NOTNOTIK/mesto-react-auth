import React from "react";
import PopupWithForm from "./PopupWithForm";


export default function AddPlacePopup(props) {

const name = React.useRef(null)
const link = React.useRef(null)
    function handleSubmit(e) {

        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        props.onAddPlace({
            name: name.current.value,
            link: link.current.value
        });

      }

      return(
        <PopupWithForm
        name="add"
        isOpen={props.isOpen}
        title="Новое Место"
        buttonText="Создать"
        onClose={props.onClose}
        onSubmit={handleSubmit}
        children={
          <>
            <label>
              <input
                type="text"
                placeholder="Название"
                name="title"
                className="popup__input"
                required
                minLength={2}
                maxLength={30}
                autoComplete="off"
                ref={name}
              />
              <span className="error" id="title-error" />
            </label>
            <label className="popup__label">
              <input
                type="url"
                placeholder="Ссылка на картинку"
                name="url"
                className="popup__input"
                autoComplete="off"
                required
                ref={link}
              />
              <span className="error" id="url-error" />
            </label>
          </>
        }
      />
      )

}