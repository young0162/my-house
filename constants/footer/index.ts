import { InstagramIcon, YoutubeIcon, BlogIcon } from "@/components/Common/Icon";

export const FOOTER_LINKS = [
  {
    title: "고객센터",
    items: [
      { label: "공지사항", href: "#" },
      { label: "자주 묻는 질문", href: "#" },
      { label: "1:1 문의", href: "#" },
      { label: "이용 가이드", href: "#" },
    ],
  },
  {
    title: "서비스",
    items: [
      { label: "스토어", href: "#" },
      { label: "커뮤니티", href: "#" },
      { label: "전문가 찾기", href: "#" },
      { label: "집들이", href: "#" },
    ],
  },
  {
    title: "회사",
    items: [
      { label: "회사소개", href: "#" },
      { label: "채용", href: "#" },
      { label: "광고/제휴 문의", href: "#" },
      { label: "입점 문의", href: "#" },
    ],
  },
];

export const POLICY_LINKS = [
  { label: "서비스 이용약관", href: "#" },
  { label: "개인정보 처리방침", href: "#" },
  { label: "위치기반 서비스 이용약관", href: "#" },
  { label: "청소년 보호정책", href: "#" },
];

export const SOCIAL_LINKS = [
  { label: "인스타그램", href: "#", Icon: InstagramIcon },
  { label: "유튜브", href: "#", Icon: YoutubeIcon },
  { label: "블로그", href: "#", Icon: BlogIcon },
];

export const COMPANY_INFO = [
  { label: "상호명", value: "버킷플레이스" },
  { label: "대표자", value: "이승재" },
  { label: "사업자등록번호", value: "876-81-00888" },
  { label: "통신판매업신고번호", value: "제2016-서울강남-02068호" },
  { label: "주소", value: "서울특별시 강남구 테헤란로 521, 파르나스타워 25층" },
];
