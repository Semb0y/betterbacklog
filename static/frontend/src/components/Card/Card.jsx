import React from "react";
import styles from "./Card.module.css";
import { CONTENT } from "../../services/constants";

export const Card = ({ suggestion, date }) => {
  if (!suggestion) return null;

  if (
    !suggestion.satisfied ||
    !suggestion.notSatisfied ||
    !suggestion.partial
  ) {
    console.error("Invalid suggestion format:", suggestion);
    return null;
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.resultCard}>
        <h4 className={styles.resultHeader}>✨ {CONTENT.CARD.TITLE}</h4>

        <div className={styles.sections}>
          {suggestion.satisfied.length > 0 && (
            <div className={styles.satisfied}>
              <h5 className={styles.sectionTitle}>✅ Strengths</h5>
              {suggestion.satisfied.map((item, index) => (
                <div key={index} className={styles.criterionBlock}>
                  <p className={styles.criterionName}>{item.criterion}</p>
                  <p className={styles.feedback}>{item.feedback}</p>
                </div>
              ))}
            </div>
          )}

          {suggestion.notSatisfied.length > 0 && (
            <div className={styles.notSatisfied}>
              <h5 className={styles.sectionTitle}>❌ Critical Issues</h5>
              {suggestion.notSatisfied.map((item, index) => (
                <div key={index} className={styles.criterionBlock}>
                  <p className={styles.criterionName}>{item.criterion}</p>
                  <p className={styles.feedback}>{item.feedback}</p>
                </div>
              ))}
            </div>
          )}

          {suggestion.partial.length > 0 && (
            <div className={styles.partial}>
              <h5 className={styles.sectionTitle}>⚠️ Needs Improvement</h5>
              {suggestion.partial.map((item, index) => (
                <div key={index} className={styles.criterionBlock}>
                  <p className={styles.criterionName}>{item.criterion}</p>
                  <p className={styles.feedback}>{item.feedback}</p>
                </div>
              ))}
            </div>
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
