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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Optical Character Recognition (OCR)</h3>
              <p className="text-xs text-slate-500">Extract raw text from textbook photos, screenshots, and scans</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
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
            className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-sky-500 bg-sky-50/50' 
                : 'border-slate-300 hover:border-sky-400 bg-white/70 hover:bg-slate-50/80'
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
                  className="max-h-48 rounded-2xl mx-auto border border-slate-200 shadow-xs object-contain"
                />
                <div className="text-xs text-slate-500">{file?.name} &bull; Click to change image</div>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-800 text-sm">Upload or drop image here</div>
                <div className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, textbook screenshots</div>
              </div>
            )}
          </div>
        )}

        {/* Extract Button */}
        {file && !extractedText && (
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleExtract}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 text-sky-400 animate-spin" />
                  <span>Scanning Multimodal Vision...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 text-sky-400" />
                  <span>Extract Text from Image</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Extracted Text View */}
        {extractedText && (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Extracted Raw Text ({extractedText.split(/\s+/).length} words)
            </div>
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows={8}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 font-medium leading-relaxed focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 resize-none"
            />
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
              <button
                onClick={() => { setExtractedText(''); setFile(null); setPreviewUrl(null); }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Scan Another Image
              </button>
              <button
                onClick={handleApply}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <span>Load into Editor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
