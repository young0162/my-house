"use client";

import { useState } from "react";
import Link from "next/link";
import Text from "@/components/Common/Text";
import { FOOTER_LINKS, POLICY_LINKS, SOCIAL_LINKS, COMPANY_INFO } from "@/constants/footer";
import styles from "./Footer.module.scss";

const Footer = () => {
  const [companyOpen, setCompanyOpen] = useState(false);

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>

        {/* 상단 링크 섹션 */}
        <div className={styles.top}>
          <div className={styles.linkGroups}>
            {FOOTER_LINKS.map(({ title, items }) => (
              <div key={title} className={styles.linkGroup}>
                <Text tag="strong" fontSize={14} fontWeight={700} color="gray01">
                  {title}
                </Text>
                <ul className={styles.linkList}>
                  {items.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className={styles.link}>
                        <Text tag="span" fontSize={13} color="gray01">
                          {label}
                        </Text>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 소셜 + 앱 다운로드 */}
          <div className={styles.sideSection}>
            <Text tag="strong" fontSize={14} fontWeight={700} color="gray01">
              SNS
            </Text>
            <ul className={styles.socialList}>
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <Link href={href} className={styles.socialBtn} aria-label={label}>
                    <Icon />
                  </Link>
                </li>
              ))}
            </ul>

            <div className={styles.appBadges}>
              <Link href="#" className={styles.appBadge}>
                <Text tag="span" fontSize={12} fontWeight={600} color="gray01">App Store</Text>
              </Link>
              <Link href="#" className={styles.appBadge}>
                <Text tag="span" fontSize={12} fontWeight={600} color="gray01">Google Play</Text>
              </Link>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className={styles.divider} />

        {/* 정책 링크 */}
        <nav className={styles.policyNav} aria-label="약관 및 정책">
          <ul className={styles.policyList}>
            {POLICY_LINKS.map(({ label, href }, index) => (
              <li key={label} className={styles.policyItem}>
                <Link href={href} className={styles.policyLink}>
                  <Text tag="span" fontSize={12} fontWeight={index === 0 ? 700 : 400} color="gray01">
                    {label}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 사업자 정보 */}
        <div className={styles.companySection}>
          <button
            type="button"
            className={styles.companyToggle}
            onClick={() => setCompanyOpen((prev) => !prev)}
            aria-expanded={companyOpen}
          >
            <Text tag="span" fontSize={12} color="gray01">
              버킷플레이스 사업자 정보
            </Text>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className={`${styles.toggleIcon} ${companyOpen ? styles.open : ""}`}
            >
              <path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {companyOpen && (
            <ul className={styles.companyInfo}>
              {COMPANY_INFO.map(({ label, value }) => (
                <li key={label} className={styles.companyItem}>
                  <Text tag="span" fontSize={12} color="gray01">{label}</Text>
                  <Text tag="span" fontSize={12} color="gray01">&nbsp;{value}</Text>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 카피라이트 */}
        <div className={styles.copyright}>
          <Text tag="span" fontSize={12} color="gray01">
            © 2015 Bucketplace Co., Ltd. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
