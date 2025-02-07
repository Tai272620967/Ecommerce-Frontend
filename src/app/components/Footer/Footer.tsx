import "./Footer.scss";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../../public/images/logo-muji.svg";

const Footer: React.FC = () => {
  return (
    <div className="footer__wrapper">
      <div className="footer__site-map">
        <div className="footer__site-map__logo-box">
          <Link href={"/"} className="navbar-logo">
            <Logo />
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
            <li className="footer__site-map__list__item">店舗情報</li>
            <li className="footer__site-map__list__item">イベント</li>
            <li className="footer__site-map__list__item">ローカルニッポン</li>
            <li className="footer__site-map__list__item">MUJI SUPPORT</li>
            <li className="footer__site-map__list__item">空間設計</li>
            <li className="footer__site-map__list__item">お問い合わせ</li>
          </ul>
        </div>
        <div className="footer__site-map__list-wrapper">
          <ul className="footer__site-map__list">
            <li className="footer__site-map__list__item">無印良品の家</li>
            <li className="footer__site-map__list__item">Café&Meal MUJI</li>
            <li className="footer__site-map__list__item">キャンプ場</li>
            <li className="footer__site-map__list__item">Found MUJI</li>
            <li className="footer__site-map__list__item">MUJI BOOKS</li>
            <li className="footer__site-map__list__item">MUJI HOTEL</li>
          </ul>
        </div>
        <div className="footer__site-map__list-wrapper">
          <ul className="footer__site-map__list">
            <li className="footer__site-map__list__item">MUJI passport</li>
            <li className="footer__site-map__list__item">カタログ</li>
            <li className="footer__site-map__list__item">MUJI Card</li>
            <li className="footer__site-map__list__item">MUJI GIFT CARD</li>
            <li className="footer__site-map__list__item">法人のお客様へ</li>
            <li className="footer__site-map__list__item">Tax-free Services</li>
          </ul>
        </div>
        <div className="footer__site-map__list-wrapper">
          <ul className="footer__site-map__list">
            <li className="footer__site-map__list__item">ニュースリリース</li>
            <li className="footer__site-map__list__item">採用情報</li>
            <li className="footer__site-map__list__item">無印良品メッセージ</li>
            <li className="footer__site-map__list__item">無印良品について</li>
            <li className="footer__site-map__list__item">株式会社　良品計画</li>
          </ul>
        </div>
      </div>
      <div className="footer__navigation">
        <div className="footer__navigation__navi-link">
            <ul className="footer__navigation__navi-link__list">
                <li className="footer__navigation__navi-link__list__item">日本</li>
                <li className="footer__navigation__navi-link__list__item">プライバシーポリシー</li>
                <li className="footer__navigation__navi-link__list__item">外部送信ポリシー</li>
                <li className="footer__navigation__navi-link__list__item">特定商取引法</li>
                <li className="footer__navigation__navi-link__list__item">サイトマップ</li>
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
