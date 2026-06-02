"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Text from "@/components/Common/Text";
import styles from "./page.module.scss";
import { ACCOUNT_LINKS, SOCIAL_ITEMS } from "@/constants/login";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("이메일 또는 비밀번호를 확인해주세요.");
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? "/");
    router.refresh();
  };

  const handleKakaoLogin = () => {
    signIn("kakao", {
      callbackUrl: searchParams.get("callbackUrl") ?? "/",
    });
  };

  return (
    <main className={styles.root}>
      <article className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>
            <Text tag="span" fontSize={28} fontWeight={800} color="gray01">
              오늘의집
            </Text>
          </h1>
        </header>

        <form className={styles.form} onSubmit={handleEmailLogin}>
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend style={{ display: "none" }}>이메일 로그인</legend>
            <input
              name="email"
              type="email"
              placeholder="이메일 주소"
              className={styles.input}
              autoComplete="email"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              className={styles.input}
              autoComplete="current-password"
              style={{ marginTop: 10 }}
              required
            />
          </fieldset>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.loginBtn} disabled={isSubmitting}>
            <Text tag="span" fontSize={16} fontWeight={600} color="gray01">
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Text>
          </button>
        </form>

        <nav aria-label="계정 관련 링크">
          <ul className={styles.links}>
            {ACCOUNT_LINKS.flatMap((item, index) => {
              const li = (
                <li key={item.label}>
                  <a href={item.href} className={styles.link}>
                    <Text tag="span" fontSize={13}>
                      {item.label}
                    </Text>
                  </a>
                </li>
              );
              if (index === ACCOUNT_LINKS.length - 1) return [li];
              return [
                li,
                <li key={`dot-${index}`} aria-hidden="true">
                  <span className={styles.dot}>·</span>
                </li>,
              ];
            })}
          </ul>
        </nav>

        <div className={styles.divider} role="separator">
          <div className={styles.dividerLine} />
          <Text tag="span" fontSize={13} color="gray01">
            또는
          </Text>
          <div className={styles.dividerLine} />
        </div>

        <section aria-label="소셜 로그인">
          <ul className={styles.socialList}>
            {SOCIAL_ITEMS.map(({ key, label, Icon }) => (
              <li key={key}>
                <button
                  type="button"
                  className={`${styles.socialBtn} ${styles[key]}`}
                  onClick={handleKakaoLogin}
                >
                  <Icon />
                  <Text tag="span" fontSize={15} fontWeight={500}>
                    {label}
                  </Text>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
