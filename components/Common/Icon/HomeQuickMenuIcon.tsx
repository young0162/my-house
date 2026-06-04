import type { HomeQuickMenuIconName } from "@/types/home";

export const HomeQuickMenuIcon = ({ name, color }: { name: HomeQuickMenuIconName; color: string }) => {
  const common = { stroke: color, strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (name === "deal") return <svg width="38" height="38" viewBox="0 0 40 40" fill={color} aria-hidden="true"><path d="M22 2 8 22h11l-2 16 15-22H21z" /></svg>;
  if (name === "clover") return <svg width="38" height="38" viewBox="0 0 40 40" fill={color} aria-hidden="true"><path d="M20 18C8 4 1 18 12 22 1 26 9 39 20 25c11 14 19 1 8-3 11-4 4-18-8-4Z" /><circle cx="20" cy="22" r="3" fill="#fff" /></svg>;
  if (name === "shopping") return <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M7 10h22l5 8-16 16L6 22z" fill={color} /><circle cx="14" cy="18" r="2" fill="#fff" /><circle cx="22" cy="18" r="2" fill="#fff" /></svg>;
  if (name === "coupon") return <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M8 12 27 5l7 21-19 7L8 12Z" fill={color} /><path d="m16 16 10 7M23 14l-4 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (name === "camera") return <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true"><rect x="6" y="12" width="28" height="21" rx="5" fill={color} /><path d="M15 12l2-5h7l2 5" fill={color} /><circle cx="20" cy="22" r="6" fill="#fff" /><circle cx="20" cy="22" r="3" fill={color} /></svg>;
  if (name === "market") return <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M8 15h24v20H8z" fill={color} /><path d="M6 15h28l-5-8H11z" fill={color} /><path d="M15 20v8M21 20v8M27 20v8" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (name === "delivery") return <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M4 10h21v20H4zM25 17h7l5 7v6H25z" fill={color} /><path d="m10 16 4 4 6-8" stroke="#fff" strokeWidth="2" /><circle cx="11" cy="31" r="3" fill="#fff" stroke={color} strokeWidth="2" /><circle cx="31" cy="31" r="3" fill="#fff" stroke={color} strokeWidth="2" /></svg>;
  if (name === "cleaning") return <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M7 31h16l-2-15H9zM27 5l-3 29" {...common} /><path d="M27 29h8l2 6H25z" fill={color} /></svg>;
  if (name === "internet") return <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M5 14c9-9 21-9 30 0M10 20c6-6 14-6 20 0M15 26c3-3 7-3 10 0" {...common} strokeWidth="4" /><circle cx="20" cy="32" r="3" fill={color} /></svg>;
  return <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M8 33V18l12-10 12 10v15z" fill={color} /><path d="M16 33V23h8v10M13 18l7-6 7 6" stroke="#fff" strokeWidth="2" /></svg>;
};
