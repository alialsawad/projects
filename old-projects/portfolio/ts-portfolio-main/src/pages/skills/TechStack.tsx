import { Footer } from "components/Footer";
import { TableCell, TableHeadCell, TableRow } from "components/Table";
import React, { useId } from "react";
import GitHubCalendar from "react-github-calendar";
import uuid from "react-uuid";
import styles from "./TechStack.module.css";

interface TechStackProps {
  data: { [key: string]: string }[];
}
function TechStack({ data }: TechStackProps) {
  return (
    <>
      <div className={styles.outer_container}>
        {data.map((item) => (
          <TableRow key={uuid()}>
            <TableHeadCell>
              <div className={styles.container}>
                <div className={styles.container__progressbars}>
                  <div className={styles.progressbar}>
                    <svg
                      className={styles.progressbar__svg}
                      style={{
                        stroke: item.color,
                      }}
                    >
                      <circle
                        cx="80"
                        cy="80"
                        r="55"
                        className={`${styles.progressbar__svg_circle} ${
                          styles[item.progress]
                        } ${styles.shadow}`}
                      ></circle>
                    </svg>
                    <span
                      className={`${styles.progressbar__text} ${styles.shadow} `}
                    >
                      {item.title}
                    </span>
                  </div>
                </div>
                <TableCell>{item.description}</TableCell>
              </div>
            </TableHeadCell>
          </TableRow>
        ))}
        <span className={styles.calender}>
          <GitHubCalendar username="alialsawad" blockSize={20} />
        </span>
        <Footer />
      </div>
    </>
  );
}

export default TechStack;
