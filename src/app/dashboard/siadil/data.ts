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
];

// Data sampel baru yang lebih realistis
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

// Helper untuk format tanggal YYYY-MM-DD HH:mm
const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const generateDummyData = (count: number): Document[] => {
  const generatedDocs: Document[] = [];

  for (let i = 1; i <= count; i++) {
    const parentFolder = allArchives[i % allArchives.length];
    const appData = sampleApps[i % sampleApps.length];

    const createdDate = new Date(2024, 0, 1 + i, i % 24, i % 60);
    const updatedDate = new Date(
      createdDate.getTime() + 2 * 24 * 60 * 60 * 1000
    );
    const expireDate = new Date(
      updatedDate.getFullYear() + 2,
      updatedDate.getMonth(),
      updatedDate.getDate()
    );

    const doc: Document = {
      id: `${75000 + i}`, // ID numerik
      parentId: parentFolder.id,
      number: appData.number,
      title: appData.title,
      description: appData.description,
      documentDate: createdDate.toISOString().split("T")[0],
      contributors: [
        {
          name: sampleContributors[i % sampleContributors.length],
          role: "Penulis",
        },
      ],
      archive: parentFolder.code,
      expireDate: expireDate.toISOString().split("T")[0],
      status: Math.random() > 0.1 ? "Active" : "Expired",
      updatedBy: sampleUserIDs[i % sampleUserIDs.length], // ID Pengguna numerik
      createdBy: sampleUserIDs[(i + 1) % sampleUserIDs.length], // ID Pengguna numerik
      createdDate: formatDateTime(createdDate), // Format YYYY-MM-DD HH:mm
      updatedDate: formatDateTime(updatedDate), // Format YYYY-MM-DD HH:mm
    };
    generatedDocs.push(doc);
  }
  return generatedDocs;
};

// Generate lebih banyak data
export const allDocuments: Document[] = generateDummyData(250);

export const reminders = [
  {
    id: "ssl-1",
    title: "SSL",
    description: "ssl.kampus-kujang.co.id (Non GCP)",
    message: "This document is expired 2 months 1 days",
    type: "error" as const,
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
