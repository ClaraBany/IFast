import RideOffer from "@assets/nav-bar-icons/ride-offer.png";
import MyRides from "@assets/nav-bar-icons/my-rides.png";
import RideRequest from "@assets/nav-bar-icons/ride-request.png";
import { NavLink } from "react-router";
import { Ripples } from "react-ripples-continued";

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 z-10 h-20 w-full bg-primary text-label text-white">
      <div className="flex h-full w-full items-center justify-between px-5 md:mx-auto md:w-100">
        <NavLink to={"/offer"} className="navlink group">
          <img src={RideOffer} alt="Ofertas" />
          <span>Ofertas</span>
          <div className="active-bar" />
          <Ripples color="var(--ripple-light)" />
        </NavLink>

        <NavLink to={"/myrides"} className="navlink group">
          <img src={MyRides} alt="Minhas Caronas" />
          <span>Minhas Caronas</span>
          <div className="active-bar" />
          <Ripples color="var(--ripple-light)" />
        </NavLink>

        <NavLink to={"/request"} className="navlink group">
          <img src={RideRequest} alt="Pedidos" />
          <span>Pedidos</span>
          <div className="active-bar" />
          <Ripples color="var(--ripple-light)" />
        </NavLink>
      </div>
    </nav>
  );
}
