export type FileCategory = 'Resume' | 'Certificate' | 'Cover Letter' | 'Other';

export type FileItem = {
    id: string;
    name: string;
    category: FileCategory; // 🔄 use strict union instead of string
    size: number;
    url: string;
    type: string;
    uploadDate: Date;
    version: number;
    isStarred: boolean;
  };
  
  export type FileVersion = {
    id: string;
    version: number;
    uploadDate: Date;
    url: string;
    type: string;
    category: FileCategory; // 🔄 again here
    size: number;
    name: string;
  };
  