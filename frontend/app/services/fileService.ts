// services/fileService.ts

import { FileVersion } from "@/lib/types/file"; // or use relative import if no alias

// This is a mock version – you can later replace it with a real API call.
export async function getVersionHistory(fileId: string): Promise<FileVersion[]> {
  // Replace this with an actual API call like fetch(`/api/files/${fileId}/versions`)
  return [
    {
      id: "1",
      version: 1,
      uploadDate: new Date("2024-01-01"),
      url: "/files/doc_v1.pdf",
      type: "pdf",
      category: "docs",
      size: 123456,
      name: "Document v1"
    },
    {
      id: "2",
      version: 2,
      uploadDate: new Date("2024-02-01"),
      url: "/files/doc_v2.pdf",
      type: "pdf",
      category: "docs",
      size: 234567,
      name: "Document v2"
    }
  ];
}
