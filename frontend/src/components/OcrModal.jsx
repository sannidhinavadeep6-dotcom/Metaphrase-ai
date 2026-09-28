import React, { useState, useRef } from 'react';
import { X, Camera, UploadCloud, Check, ArrowRight, Zap, Image as ImageIcon } from 'lucide-react';
import { extractOcr } from '../services/api';

export default function OcrModal({ user, onInsertText, onClose, onNotify }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (f) => {
    if (!f.type.startsWith('image/')) {
      onNotify('Please upload a valid image file (.png, .jpg, .webp).', 'error');
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setExtractedText('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await extractOcr(file, user?.email);
      setExtractedText(data.extracted_text || '');
      onNotify(`Extracted ${data.word_count} words from image!`, 'success');
    } catch (err) {
      onNotify(err.message || 'OCR parsing failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!extractedText) return;
    onInsertText(extractedText);
    onClose();
    onNotify('Text loaded into editor!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#1C1C1C]">Optical Character Recognition (OCR)</h3>
              <p className="text-xs sm:text-sm text-[#646B81]">Extract text from textbook photos, screenshots, and scans</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone / Preview */}
        {!extractedText && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-[#027E6F] bg-emerald-50/60' 
                : 'border-gray-300 hover:border-[#027E6F] bg-[#F9F9FB] hover:bg-emerald-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            {previewUrl ? (
              <div className="space-y-3">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="max-h-48 mx-auto rounded-xl shadow-xs border border-gray-200 object-contain"
                />
                <div className="text-xs font-semibold text-gray-700">
                  {file?.name} ({(file?.size / 1024).toFixed(1)} KB) &bull; <span className="text-[#027E6F]">Click to change image</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="font-bold text-[#1C1C1C] text-sm sm:text-base">Drop document screenshot or photo here</div>
                <div className="text-xs text-[#646B81]">PNG, JPG, JPEG, or WEBP up to 10MB</div>
              </div>
            )}
          </div>
        )}

        {/* Action Button: Run OCR */}
        {file && !extractedText && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => { setFile(null); setPreviewUrl(null); }}
              className="grammarly-secondary-btn px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={handleExtract}
              disabled={loading}
              className="grammarly-green-btn flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 text-white animate-spin" />
                  <span>Scanning image...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Extract Text from Image</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Extracted Text View */}
        {extractedText && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-[#E6F5F2] border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-emerald-950">
                <Check className="w-4 h-4 text-[#027E6F]" />
                <span>Text Successfully Extracted</span>
              </div>
              <button
                onClick={() => { setExtractedText(''); setFile(null); setPreviewUrl(null); }}
                className="text-xs font-semibold text-[#027E6F] hover:underline cursor-pointer"
              >
                Scan Another
              </button>
            </div>

            <textarea
              rows={6}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="w-full bg-[#F9F9FB] border border-gray-300 rounded-2xl p-4 text-xs sm:text-sm text-[#1C1C1C] focus:outline-none focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20 resize-none font-normal shadow-2xs"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="grammarly-secondary-btn px-5 py-2 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleApply}
                className="grammarly-green-btn flex items-center gap-2 px-6 py-2.5 text-xs font-bold shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Insert into Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
