import { useEffect } from "react";

export function useDocumentTitle(title: string, override = false) {
  useEffect(() => {
    document.title = override ? title : "[Racky] " + title;
    console.log("Title set to", document.title);
  }, [title]);
}
