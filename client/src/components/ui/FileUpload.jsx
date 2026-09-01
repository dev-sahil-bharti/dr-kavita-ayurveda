import React, { useState, useRef } from 'react';
import { UploadCloud, File, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../services/api/client';
import { API_ENDPOINTS } from '../../services/api/endpoints';

const FileUpload = ({ onUploadSuccess, accept = "image/*,application/pdf", maxSizeMB = 5 }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    
    // Size check
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      toast.error(`File size should be less than ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post(API_ENDPOINTS.UPLOAD || '/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(progress);
        },
      });

      if (response.data?.success) {
        toast.success('File uploaded successfully!');
        setUploadedUrl(response.data.data.url);
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadedUrl('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = file?.type?.startsWith('image/');

  return (
    <div className="w-full max-w-md mx-auto">
      {!file && !uploadedUrl && (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ease-in-out cursor-pointer
            ${isDragging ? 'border-emerald-500 bg-emerald-50/50' : 'border-stone-300 hover:border-emerald-500 bg-stone-50'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={accept}
            className="hidden"
          />
          <UploadCloud className={`mx-auto h-12 w-12 ${isDragging ? 'text-emerald-600' : 'text-stone-400'}`} />
          <p className="mt-4 text-sm font-medium text-stone-800">
            Click to upload medical reports or drag and drop
          </p>
          <p className="mt-1 text-xs text-stone-500">
            PDF, JPG, PNG up to {maxSizeMB}MB
          </p>
        </div>
      )}

      {file && !uploadedUrl && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
                {isImage ? <ImageIcon className="h-6 w-6 text-emerald-600" /> : <File className="h-6 w-6 text-emerald-600" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-stone-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={resetUpload}
                className="p-1 hover:bg-stone-100 rounded-full transition-colors shrink-0"
              >
                <X className="h-5 w-5 text-stone-500" />
              </button>
            )}
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-stone-500">Uploading...</span>
                <span className="font-medium text-emerald-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {!isUploading && (
            <button
              onClick={handleUpload}
              className="mt-4 w-full flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Report</span>
            </button>
          )}
        </div>
      )}

      {uploadedUrl && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="shrink-0">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-emerald-900">Upload Complete</p>
              <a 
                href={uploadedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-emerald-700 hover:underline truncate block mt-1"
              >
                {uploadedUrl}
              </a>
            </div>
            <button
              onClick={resetUpload}
              className="shrink-0 text-sm text-emerald-800 hover:text-emerald-950 font-medium"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
