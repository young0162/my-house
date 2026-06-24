"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authApiService } from "@/services/auth.api";
import styles from "./page.module.scss";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      await authApiService.register({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        name: formData.get("name") ? String(formData.get("name")) : undefined,
      });
      router.push("/login?registered=1");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        "회원가입에 실패했습니다.";
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.root}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>회원가입</h1>
        <input className={styles.input} name="name" placeholder="이름" autoComplete="name" />
        <input className={styles.input} name="email" type="email" placeholder="이메일 주소" autoComplete="email" required />
        <input
          className={styles.input}
          name="password"
          type="password"
          placeholder="비밀번호"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.submitBtn} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "가입 중..." : "가입하기"}
        </button>
      </form>
    </main>
  );
}
