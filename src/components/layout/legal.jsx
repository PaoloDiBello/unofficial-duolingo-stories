import React from "react";
import Link from "next/link";

import styles from "./legal.module.css";

export default function Legal({ language_name }) {
  return (
    <small className={styles.legal}>
      {language_name ? (
        ""
      ) : (
        <>
          <Link href="/privacy_policy">Privacy Policy</Link>
          <br />
          <br />
        </>
      )}
      These stories are owned by Duolingo, Inc. and are used under license from
      Duolingo.
      <br />
      Duolingo is not responsible for the translation of these stories{" "}
      <span id="license_language">
        {language_name ? "into " + language_name : ""}
      </span>{" "}
      and this is not an official product of Duolingo.
      <br />
      Any further use of these stories requires a license from Duolingo.
      <br />
      Visit <Link href="https://www.duolingo.com">www.duolingo.com</Link> for
      more information.
    </small>
  );
}
