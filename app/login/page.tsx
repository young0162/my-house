"use client";

import Text from "@/components/Common/Text";
import styles from "./page.module.scss";
import { ACCOUNT_LINKS, SOCIAL_ITEMS } from "@/constants/login";

export default function LoginPage() {
  return (
    <main className={styles.root}>
      <article className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>
            <Text tag="span" fontSize={28} fontWeight={800} color="#222">
              오늘의집
            </Text>
          </h1>
        </header>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend style={{ display: "none" }}>이메일 로그인</legend>
            <input type="email" placeholder="이메일 주소" className={styles.input} autoComplete="email" />
            <input
              type="password"
              placeholder="비밀번호"
              className={styles.input}
              autoComplete="current-password"
              style={{ marginTop: 10 }}
            />
          </fieldset>
          <button type="submit" className={styles.loginBtn}>
            <Text tag="span" fontSize={16} fontWeight={600} color="#222">
              로그인
            </Text>
          </button>
        </form>

        <nav aria-label="계정 관련 링크">
          <ul className={styles.links}>
            {ACCOUNT_LINKS.map((item, index) => (
              <>
                <li key={item.label}>
                  <a href={item.href} className={styles.link}>
                    <Text tag="span" fontSize={13}>{item.label}</Text>
                  </a>
                </li>
                {index < ACCOUNT_LINKS.length - 1 && (
                  <li key={`dot-${index}`} aria-hidden="true">
                    <span className={styles.dot}>·</span>
                  </li>
                )}
              </>
            ))}
          </ul>
        </nav>

        <div className={styles.divider} role="separator">
          <div className={styles.dividerLine} />
          <Text tag="span" fontSize={13} color="#444">또는</Text>
          <div className={styles.dividerLine} />
        </div>

        <section aria-label="소셜 로그인">
          <ul className={styles.socialList}>
            {SOCIAL_ITEMS.map(({ key, label, Icon }) => (
              <li key={key}>
                <button type="button" className={`${styles.socialBtn} ${styles[key]}`}>
                  <Icon />
                  <Text tag="span" fontSize={15} fontWeight={500}>{label}</Text>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
