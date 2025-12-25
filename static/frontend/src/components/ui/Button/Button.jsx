import React from "react";
import styles from "./Button.module.css";

export const Button = ({ onClick, disabled, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={styles.button}
    >
      <span className={styles.content}>
        {loading ? (
          <>
            <span className={styles.spinner} />
            <span>Analyse en cours...</span>
          </>
        ) : (
          <>
            <span className={disabled ? styles.iconDisabled : styles.icon}>
              ✨
            </span>
            <span>Analyser</span>
          </>
        )}
      </span>
    </button>
  );
};
