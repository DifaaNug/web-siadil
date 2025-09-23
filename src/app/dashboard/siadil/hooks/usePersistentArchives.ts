import { useState, useEffect } from "react";
import { Archive } from "../types";
import { allArchives as initialArchives } from "../data";

const SIADIL_ARCHIVES_KEY = "siadil_archives_storage";

export function usePersistentArchives(): [
  Archive[],
  React.Dispatch<React.SetStateAction<Archive[]>>
] {
  const [archives, setArchives] = useState<Archive[]>(initialArchives);

  useEffect(() => {
    try {
      const storedArchives = localStorage.getItem(SIADIL_ARCHIVES_KEY);
      if (storedArchives) {
        setArchives(JSON.parse(storedArchives));
      }
    } catch (error) {
      console.error("Gagal mengambil data arsip dari localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SIADIL_ARCHIVES_KEY, JSON.stringify(archives));
    } catch (error) {
      console.error("Gagal menyimpan data arsip ke localStorage", error);
    }
  }, [archives]);

  return [archives, setArchives];
}
