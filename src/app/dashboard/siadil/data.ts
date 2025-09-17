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

export const generateDummyData = (count: number): Document[] => {
  const generatedDocs: Document[] = [];
  const sampleTitles = [
    "Surat Keputusan",
    "Memorandum of Understanding",
    "Standard Operating Procedure",
    "Laporan Keuangan",
    "Laporan Audit Internal",
    "Kebijakan Keamanan",
    "Materi Training",
    "Kontrak Pengadaan",
  ];
  const sampleNames = [
    "Budi Santoso",
    "Siti Aisyah",
    "Rizki Pratama",
    "Dewi Lestari",
    "Agus Wijaya",
    "Rina Hartono",
  ];
  const sampleDepts = [
    "IT Department",
    "Legal Dept",
    "Finance Dept",
    "HR Department",
    "Internal Audit",
    "Management",
  ];

  for (let i = 1; i <= count; i++) {
    const parentFolder = allArchives[i % allArchives.length];
    const createdDate = new Date(2023, 0, 1 + i * 3);
    const updatedDate = new Date(
      createdDate.getTime() + 2 * 24 * 60 * 60 * 1000
    );
    const expireDate = new Date(
      updatedDate.getFullYear() + 2,
      updatedDate.getMonth(),
      updatedDate.getDate()
    );

    const doc: Document = {
      id: `DOC${String(i).padStart(3, "0")}`,
      parentId: parentFolder.id,
      number: `${parentFolder.code}/${String(i).padStart(
        3,
        "0"
      )}/${createdDate.getFullYear()}`,
      title: `${sampleTitles[i % sampleTitles.length]} #${i}`,
      description: `Deskripsi untuk dokumen nomor ${i}.`,
      documentDate: createdDate.toISOString().split("T")[0],
      contributors: [
        { name: sampleNames[i % sampleNames.length], role: "Penulis" },
      ],
      archive: parentFolder.code,
      expireDate: expireDate.toISOString().split("T")[0],
      status: Math.random() > 0.1 ? "Active" : "Expired",
      updatedBy: sampleDepts[i % sampleDepts.length],
      createdBy: sampleDepts[(i + 1) % sampleDepts.length],
      createdDate: createdDate.toISOString().split("T")[0],
      updatedDate: updatedDate.toISOString().split("T")[0],
    };
    generatedDocs.push(doc);
  }
  return generatedDocs;
};

export const allDocuments: Document[] = generateDummyData(100);

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
