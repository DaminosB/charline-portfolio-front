"use client";

import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <ErrorComponent error={error} reset={reset} type={"error"} />
      </body>
    </html>
  );
}
