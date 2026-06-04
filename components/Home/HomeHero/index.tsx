import HomeMainFeature from "@/components/Home/HomeMainFeature";
import HomePromoSlider from "@/components/Home/HomePromoSlider";
import { HOME_MAIN_FEATURE, HOME_PROMO_ITEMS } from "@/constants/home";
import styles from "./index.module.scss";

const HomeHero = () => (
  <section className={styles.root} aria-label="오늘의 추천 콘텐츠">
    <HomeMainFeature item={HOME_MAIN_FEATURE} />
    <HomePromoSlider items={HOME_PROMO_ITEMS} />
  </section>
);

export default HomeHero;
