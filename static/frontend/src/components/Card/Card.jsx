import React from "react";
import styles from "./Card.module.css";
import { CONTENT } from "../../services/constants";

export const Card = ({ suggestion, date, isOutdated }) => {
  if (!suggestion || typeof suggestion === "string") return null;

  const categories = [
    { key: "satisfied", label: "Satisfied", className: styles.satisfied },
    { key: "failed", label: "Failed", className: styles.failed },
    { key: "partial", label: "Needs Improvement", className: styles.partial },
  ];

  return (
    <div className={styles.cardContainer}>
      <p className={isOutdated ? styles.warningText : styles.infoText}>
        {isOutdated ? CONTENT.MESSAGES.WARNING : CONTENT.MESSAGES.SUCCESS}
      </p>

      <div className={styles.resultCard}>
        <h4 className={styles.resultHeader}>✨ {CONTENT.CARD.TITLE}</h4>

        <div className={styles.sections}>
          {categories.map(
            (cat) =>
              suggestion[cat.key]?.length > 0 && (
                <div key={cat.key} className={cat.className}>
                  {suggestion[cat.key].map((line, index) => (
                    <p key={index} className={styles.analysisLine}>
                      {line}
                    </p>
                  ))}
                </div>
              )
          )}
        </div>

        {date && (
          <div className={styles.footer}>
            {CONTENT.CARD.FOOTER}
            {date}
          </div>
        )}
      </div>
    </div>
  );
};
