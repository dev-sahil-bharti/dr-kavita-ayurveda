import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, File, Image as ImageIcon, X, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        toast.success('File uploaded successfully!');
        setUploadedUrl(response.data.data.url);
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
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
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
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
          <UploadCloud className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="mt-4 text-sm font-medium text-gray-900">
            Click to upload or drag and drop
          </p>
          <p className="mt-1 text-xs text-gray-500">
            SVG, PNG, JPG, PDF up to {maxSizeMB}MB
          </p>
        </div>
      )}

      {file && !uploadedUrl && (
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                {isImage ? <ImageIcon className="h-6 w-6 text-blue-500" /> : <File className="h-6 w-6 text-blue-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={resetUpload}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors shrink-0"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Uploading...</span>
                <span className="font-medium text-blue-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {!isUploading && (
            <button
              onClick={handleUpload}
              className="mt-4 w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload File</span>
            </button>
          )}
        </div>
      )}

      {uploadedUrl && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="shrink-0">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-900">Upload Complete</p>
              <a 
                href={uploadedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-green-700 hover:underline truncate block mt-1"
              >
                {uploadedUrl}
              </a>
            </div>
            <button
              onClick={resetUpload}
              className="shrink-0 text-sm text-green-700 hover:text-green-900 font-medium"
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
