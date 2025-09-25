import { useState, useMemo, ChangeEvent } from "react";
import { Document, Filters } from "../types";

const initialFilters: Filters = {
  keyword: "",
  archive: [],
  docDateStart: "",
  docDateEnd: "",
  expireDateStart: "",
  expireDateEnd: "",
  expireIn: {},
  fileType: "",
};

export const useDocumentFilters = (
  documentsForFiltering: Document[],
  setDocumentCurrentPage: (page: number) => void
) => {
  const [filters, setFilters] = useState(initialFilters);
  const [expireFilterMethod, setExpireFilterMethod] = useState<
    "range" | "period"
  >("range");

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setDocumentCurrentPage(1);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const newExpireIn = { ...prev.expireIn };
      if (checked) {
        newExpireIn[value] = true;
      } else {
        delete newExpireIn[value];
      }
      return { ...prev, expireIn: newExpireIn };
    });
    setDocumentCurrentPage(1);
  };

  const handleArchiveCheckboxChange = (
    archiveCode: string,
    isChecked: boolean
  ) => {
    setFilters((prev) => {
      const currentArchives = prev.archive || [];
      if (isChecked) {
        return { ...prev, archive: [...currentArchives, archiveCode] };
      } else {
        return {
          ...prev,
          archive: currentArchives.filter((code) => code !== archiveCode),
        };
      }
    });
    setDocumentCurrentPage(1);
  };

  const handleExpireMethodChange = (method: "range" | "period") => {
    setExpireFilterMethod(method);
    if (method === "range") {
      setFilters((prev) => ({ ...prev, expireIn: {} }));
    } else {
      setFilters((prev) => ({
        ...prev,
        expireDateStart: "",
        expireDateEnd: "",
      }));
    }
  };

  const handleFilterReset = () => {
    setFilters(initialFilters);
    setDocumentCurrentPage(1);
  };

  const filteredDocuments = useMemo(() => {
    return documentsForFiltering.filter((doc) => {
      const keywordMatch =
        filters.keyword.toLowerCase() === "" ||
        doc.number.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        doc.title.toLowerCase().includes(filters.keyword.toLowerCase());

      const archiveMatch =
        filters.archive.length === 0 || filters.archive.includes(doc.archive);

      const docDateStartMatch =
        filters.docDateStart === "" || doc.documentDate >= filters.docDateStart;
      const docDateEndMatch =
        filters.docDateEnd === "" || doc.documentDate <= filters.docDateEnd;

      const fileTypeMatch =
        !filters.fileType ||
        (doc.fileType &&
          doc.fileType.toLowerCase().includes(filters.fileType.toLowerCase()));

      let finalExpireMatch = true;
      if (expireFilterMethod === "range") {
        const expireDateStartMatch =
          filters.expireDateStart === "" ||
          !!(doc.expireDate && doc.expireDate >= filters.expireDateStart);

        const expireDateEndMatch =
          filters.expireDateEnd === "" ||
          !!(doc.expireDate && doc.expireDate <= filters.expireDateEnd);

        finalExpireMatch = expireDateStartMatch && expireDateEndMatch;
      } else {
        const activeExpireInPeriods = Object.keys(filters.expireIn);
        if (activeExpireInPeriods.length > 0) {
          finalExpireMatch = activeExpireInPeriods.some((period) => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const expireDate = new Date(doc.expireDate);
            expireDate.setHours(0, 0, 0, 0);
            if (period === "expired") return expireDate < now;
            const targetDate = new Date();
            const duration = parseInt(period.replace(/\D/g, ""));
            if (period.endsWith("w")) {
              targetDate.setDate(now.getDate() + duration * 7);
            } else if (period.endsWith("m")) {
              targetDate.setMonth(now.getMonth() + duration);
            }
            return expireDate >= now && expireDate <= targetDate;
          });
        }
      }

      return (
        keywordMatch &&
        archiveMatch &&
        docDateStartMatch &&
        docDateEndMatch &&
        fileTypeMatch &&
        finalExpireMatch
      );
    });
  }, [documentsForFiltering, filters, expireFilterMethod]);

  return {
    filters,
    expireFilterMethod,
    handleFilterChange,
    handleCheckboxChange,
    handleArchiveCheckboxChange,
    handleExpireMethodChange,
    handleFilterReset,
    filteredDocuments,
  };
};
