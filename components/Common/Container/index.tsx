import { ReactNode } from "react";
import styles from "./Container.module.scss";

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => (
  <main className={styles.root}>{children}</main>
);

export default Container;
