import { Archive, Document } from "./types";

export const allArchives: Archive[] = [
  {
    id: "personal-df",
    name: "Personal",
    code: "PERSONAL",
    parentId: "root",
  },
  {
    id: "tik",
    name: "Teknologi, Informasi & Komunikasi",
    code: "TIK",
    parentId: "root",
  },
  { id: "legal", name: "Legal", code: "Legal", parentId: "root" },
  { id: "finance", name: "Finance", code: "Finance", parentId: "root" },
  { id: "hr", name: "Human Resources", code: "HR", parentId: "root" },
  { id: "audit", name: "Audit", code: "Audit", parentId: "root" },
  {
    id: "tik_laporan",
    name: "Laporan Bulanan",
    code: "TIK-Laporan",
    parentId: "tik",
  },
  {
    id: "tik_proyek",
    name: "Dokumen Proyek",
    code: "TIK-Proyek",
    parentId: "tik",
  },

  {
    id: "arsip-kosong-test",
    name: "Arsip Kosong (Test)",
    code: "TEST-EMPTY",
    parentId: "root",
  },
];

const sampleApps = [
  {
    number: "JAJAPWEB",
    title: "JAJAPWEB",
    description: "Aplikasi Jajap untuk Admin Mengelola Transaksi Jajap",
  },
  {
    number: "JAJAPDRIVER",
    title: "JAJAPDRIVER",
    description:
      "Aplikasi Jajap untuk Request Transformasi Area Kawasan Kujang",
  },
  {
    number: "APM",
    title: "APM",
    description:
      "Aplikasi Performance Monitoring Management untuk Generate Montly Report",
  },
  {
    number: "WEBKUJANGADMIN",
    title: "WEBKUJANGADMIN",
    description: "Aplikasi Panel Admin untuk Pengelolaan Website Pupuk Kujang",
  },
  {
    number: "SPIRITK3",
    title: "SPIRITK3",
    description: "Aplikasi Safety is Priority yang dikelola oleh Dept K3LH",
  },
  {
    number: "SIMRISKANPER",
    title: "SIMRISKANPER",
    description:
      "Aplikasi Sistem Manajemen Risiko untuk anak perusahaan (dikelola oleh unit Manrisk)",
  },
  {
    number: "SIMRISK",
    title: "SIMRISK",
    description:
      "Aplikasi Sistem Manajemen Risiko (dikelola oleh unit Manrisk)",
  },
  {
    number: "DOKUMENTASIAPLIKASI",
    title: "Dokumentasi Aplikasi",
    description: "Pusat dokumentasi untuk semua aplikasi internal perusahaan.",
  },
  {
    number: "DTS 3.1",
    title: "DTS 3.1",
    description: "Dokumen Teknis Spesifikasi versi 3.1 untuk proyek baru.",
  },
];

const sampleUserIDs = ["3082625", "3082626", "3082627", "3082628", "3082629"];
const sampleContributors = [
  "Budi Santoso",
  "Siti Aisyah",
  "Rizki Pratama",
  "Dewi Lestari",
  "Agus Wijaya",
  "Rina Hartono",
];

const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const generateDummyData = (): Document[] => {
  const generatedDocs: Document[] = [];
  let docIdCounter = 75000;

  const archivesToFill = allArchives.filter(
    (a) => a.code !== "PERSONAL" && a.code !== "TEST-EMPTY"
  );

  archivesToFill.forEach((archive) => {
    const docCount = 20;

    for (let i = 0; i < docCount; i++) {
      docIdCounter++;
      const appData = sampleApps[docIdCounter % sampleApps.length];

      const createdDate = new Date(
        2024,
        0,
        1 + (docIdCounter % 365),
        i % 24,
        i % 60
      );

      const updatedDate = new Date(createdDate);
      updatedDate.setDate(createdDate.getDate() + (i + 1));
      const now = new Date();
      const randomDaysToAdd = i < 3 ? -30 * (i + 1) : docIdCounter % 300;
      const expireDate = new Date(now.setDate(now.getDate() + randomDaysToAdd));

      const doc: Document = {
        id: `${docIdCounter}`,
        parentId: archive.id,
        number: `${archive.code}-${100 + i}`,
        title: `${appData.title} (${archive.name})`,
        description: appData.description,
        documentDate: createdDate.toISOString().split("T")[0],
        contributors: [
          {
            name: sampleContributors[docIdCounter % sampleContributors.length],
            role: "Penulis",
          },
        ],
        archive: archive.code,
        expireDate: expireDate.toISOString().split("T")[0],
        status: new Date(expireDate) < new Date() ? "Expired" : "Active",

        updatedBy: sampleUserIDs[docIdCounter % sampleUserIDs.length],
        createdBy: sampleUserIDs[(docIdCounter + 1) % sampleUserIDs.length],
        createdDate: formatDateTime(createdDate),
        updatedDate: formatDateTime(updatedDate),

        isStarred: docIdCounter % 10 === 0,
      };
      generatedDocs.push(doc);
    }
  });

  return generatedDocs;
};

export const allDocuments: Document[] = generateDummyData();

export const reminders = [
  {
    id: "ssl-2",
    title: "SSL",
    description: "pupuk-kujang.co.id (Non GCP)",
    message: "This document will expire in 2 months 11 days",
    type: "warning" as const,
    expireDate: "2025-12-10", // Tambahkan ini
  },
  {
    id: "kontrak-kerja",
    title: "kontrak-kerja",
    description: "pupuk-kujang.co.id (Non GCP)",
    message: "This document will expire in 2 months 11 days",
    type: "error" as const,
    expireDate: "2025-12-10", // Tambahkan ini
  },
  {
    id: "kontrak-perusahaan",
    title: "kontrak-perusahaan",
    description: "pupuk-kujang.co.id (Non GCP)",
    message: "This document will expire in 2 months 11 days",
    type: "error" as const,
    expireDate: "2025-12-10", // Tambahkan ini
  },
  {
    id: "Dokumen-legal",
    title: "Dokumen-legal",
    description: "pupuk-kujang.co.id (Non GCP)",
    message: "This document will expire in 2 months 11 days",
    type: "warning" as const,
    expireDate: "2025-12-10", // Tambahkan ini
  },
];

export const expireInOptions = [
  { id: "1w", label: "In 1 Week" },
  { id: "2w", label: "In 2 Weeks" },
  { id: "1m", label: "In 1 Month" },
  { id: "3m", label: "In 3 Months" },
  { id: "6m", label: "In 6 Months" },
  { id: "expired", label: "Already Expired" },
];
