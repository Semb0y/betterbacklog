import styles from "./Card.module.css";
import { CONTENT } from "../../services/constants";

export const Card = ({ suggestion, date, isOutdated }) => {
  if (!suggestion) return null;

  return (
    <div className={styles.cardContainer}>
      <p className={isOutdated ? styles.warningText : styles.infoText}>
        {isOutdated ? CONTENT.MESSAGES.WARNING : CONTENT.MESSAGES.SUCCESS}
      </p>

      <div className={styles.resultCard}>
        <h4 className={styles.resultHeader}>
          <span className={styles.resultIcon}>💡</span>
          {CONTENT.CARD.TITLE}
        </h4>
        <div className={styles.resultContent}>{suggestion}</div>

        {date && (
          <div className={styles.lastUpdated}>
            {CONTENT.CARD.FOOTER}
            {date}
          </div>
        )}
      </div>
    </div>
  );
};
