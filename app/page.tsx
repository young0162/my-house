import HomeCategoryNav from "@/components/Home/HomeCategoryNav";
import HomeHero from "@/components/Home/HomeHero";
import HomeQuickMenu from "@/components/Home/HomeQuickMenu";
import styles from "./page.module.scss";

const Home = () => (
  <div className={styles.root}>
    <HomeCategoryNav />
    <main className={styles.main}>
      <HomeHero />
      <HomeQuickMenu />
    </main>
  </div>
);

export default Home;
