import "./Footer.scss";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="footer__wrapper">
      <div className="footer__site-map">
        <div className="footer__site-map__logo-box">
          <Link href={"/"} className="navbar-logo">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={180}
              height={60}
              style={{ objectFit: "contain" }}
            />
          </Link>
          <ul className="footer__site-map__logo-box__socials">
            <li>
              <Link href={"/"}>
                <Image
                  src="/images/instagram.png"
                  alt="Instagram icon"
                  width={28}
                  height={28}
                />
              </Link>
            </li>
            <li>
              <Link href={"/"}>
                <Image
                  src="/images/twitter.png"
                  alt="Twitter icon"
                  width={28}
                  height={28}
                />
              </Link>
            </li>
            <li>
              <Link href={"/"}>
                <Image
                  src="/images/facebook.png"
                  alt="Facebook icon"
                  width={28}
                  height={28}
                />
              </Link>
            </li>
            <li>
              <Link href={"/"}>
                <Image
                  src="/images/tiktok.png"
                  alt="Tiktok icon"
                  width={28}
                  height={28}
                />
              </Link>
            </li>
            <li>
              <Link href={"/"}>
                <Image
                  src="/images/line.png"
                  alt="Line icon"
                  width={28}
                  height={28}
                />
              </Link>
            </li>
            <li>
              <Link href={"/"}>
                <Image
                  src="/images/youtube.png"
                  alt="Youtube icon"
                  width={28}
                  height={20}
                />
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer__site-map__list-wrapper">
          <ul className="footer__site-map__list">
            <li className="footer__site-map__list__item">Store Information</li>
            <li className="footer__site-map__list__item">Events</li>
            <li className="footer__site-map__list__item">Local Japan</li>
            <li className="footer__site-map__list__item">MUJI SUPPORT</li>
            <li className="footer__site-map__list__item">Space Design</li>
            <li className="footer__site-map__list__item">Contact Us</li>
          </ul>
        </div>
        <div className="footer__site-map__list-wrapper">
          <ul className="footer__site-map__list">
            <li className="footer__site-map__list__item">MUJI House</li>
            <li className="footer__site-map__list__item">Café&Meal MUJI</li>
            <li className="footer__site-map__list__item">Campground</li>
            <li className="footer__site-map__list__item">Found MUJI</li>
            <li className="footer__site-map__list__item">MUJI BOOKS</li>
            <li className="footer__site-map__list__item">MUJI HOTEL</li>
          </ul>
        </div>
        <div className="footer__site-map__list-wrapper">
          <ul className="footer__site-map__list">
            <li className="footer__site-map__list__item">MUJI passport</li>
            <li className="footer__site-map__list__item">Catalog</li>
            <li className="footer__site-map__list__item">MUJI Card</li>
            <li className="footer__site-map__list__item">MUJI GIFT CARD</li>
            <li className="footer__site-map__list__item">For Corporate Customers</li>
            <li className="footer__site-map__list__item">Tax-free Services</li>
          </ul>
        </div>
        <div className="footer__site-map__list-wrapper">
          <ul className="footer__site-map__list">
            <li className="footer__site-map__list__item">News Release</li>
            <li className="footer__site-map__list__item">Careers</li>
            <li className="footer__site-map__list__item">MUJI Message</li>
            <li className="footer__site-map__list__item">About MUJI</li>
            <li className="footer__site-map__list__item">Ryohin Keikaku Co., Ltd.</li>
          </ul>
        </div>
      </div>
      <div className="footer__navigation">
        <div className="footer__navigation__navi-link">
            <ul className="footer__navigation__navi-link__list">
                <li className="footer__navigation__navi-link__list__item">Japan</li>
                <li className="footer__navigation__navi-link__list__item">Privacy Policy</li>
                <li className="footer__navigation__navi-link__list__item">External Transmission Policy</li>
                <li className="footer__navigation__navi-link__list__item">Specified Commercial Transactions Act</li>
                <li className="footer__navigation__navi-link__list__item">Sitemap</li>
            </ul>
        </div>
        <div className="footer__navigation__copy-right__wrapper">
            <p className="footer__navigation__copy-right">Copyright ©Ryohin Keikaku Co., Ltd.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
