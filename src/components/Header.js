import logo from "../images/Vector.svg";
export default function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Mesto" className="header__logo" />
    </header>
  );
}
