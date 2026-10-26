import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Play,
  Eye,
  RefreshCw,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { DatasetItem } from '../types';

export const DataManagementPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Upload results & preview
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [previewModal, setPreviewModal] = useState<{ name: string; rows: any[]; columns: string[] } | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const data = await api.getDatasets();
      setDatasets(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      setActionMsg(null);
      const result = await api.uploadDataset(selectedFile);
      setUploadResult(result);
      setSelectedFile(null);
      setActionMsg({ type: 'success', text: `Uploaded "${result.dataset.name}" successfully!` });
      loadDatasets();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleProcess = async (id: number) => {
    try {
      setActionMsg({ type: 'success', text: 'Processing dataset & calculating SPI/SPEI indices...' });
      const res = await api.processDataset(id);
      setActionMsg({ type: 'success', text: res.message });
      loadDatasets();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message || 'Processing failed' });
    }
  };

  const handleDelete = async () => {
    if (deleteModalId === null) return;
    try {
      await api.deleteDataset(deleteModalId);
      setActionMsg({ type: 'success', text: 'Dataset deleted.' });
      setDeleteModalId(null);
      loadDatasets();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message || 'Delete failed' });
    }
  };

  const handleLoadDemo = async () => {
    try {
      setActionMsg({ type: 'success', text: 'Generating synthetic demo records...' });
      const res = await api.loadDemoDataset();
      setActionMsg({ type: 'success', text: res.message });
      loadDatasets();
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.message || 'Failed to load demo data' });
    }
  };

  const handlePreview = async (id: number) => {
    try {
      const res = await fetch(`/api/datasets/${id}/preview?limit=15`).then((r) => r.json());
      setPreviewModal({
        name: res.dataset_name,
        rows: res.rows,
        columns: res.columns
      });
    } catch (e: any) {
      alert('Unable to load preview');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Environmental Data Management & Quality Control
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload, validate, audit data quality, and compute meteorological drought indices (SPI & SPEI).
          </p>
        </div>

        <button
          onClick={handleLoadDemo}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Load Synthetic Demo Dataset</span>
        </button>
      </div>

      {actionMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            actionMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            {actionMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{actionMsg.text}</span>
          </div>
          <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Zone */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Upload New Hydrometeorological Dataset</h3>

        <div className="border-2 border-dashed border-slate-200 hover:border-emerald-600 rounded-2xl p-8 text-center transition-colors bg-slate-50/50">
          <UploadCloud className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Choose a CSV or Excel file</p>
          <p className="text-xs text-slate-400 mt-1">
            Supports .csv, .xlsx. Required columns: Observation Date, Precipitation/Rainfall.
          </p>

          <input
            type="file"
            id="dataset-upload"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-4 flex items-center justify-center space-x-3">
            <label
              htmlFor="dataset-upload"
              className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs"
            >
              Browse Local Files
            </label>

            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors disabled:opacity-50"
              >
                {uploading ? 'Analyzing...' : `Confirm Upload (${(selectedFile.size / 1024).toFixed(1)} KB)`}
              </button>
            )}
          </div>

          {selectedFile && (
            <div className="mt-3 text-xs text-emerald-700 font-medium">Selected: {selectedFile.name}</div>
          )}
        </div>
      </div>

      {/* Data Quality Report Display after Upload */}
      {uploadResult && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Automated Audit</span>
              <h3 className="font-bold text-slate-900 text-sm">
                Data Quality Report: {uploadResult.dataset.name}
              </h3>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                uploadResult.quality_report.validation_status === 'VALID'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              Status: {uploadResult.quality_report.validation_status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Total Records</span>
              <span className="text-lg font-bold text-slate-800">{uploadResult.quality_report.total_rows}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Valid Clean Rows</span>
              <span className="text-lg font-bold text-emerald-700">{uploadResult.quality_report.valid_rows}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Duplicate Rows</span>
              <span className="text-lg font-bold text-slate-800">{uploadResult.quality_report.duplicate_rows}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Invalid Dates</span>
              <span className="text-lg font-bold text-slate-800">{uploadResult.quality_report.invalid_dates}</span>
            </div>
          </div>

          {/* Warnings list */}
          {uploadResult.quality_report.warnings.length > 0 && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-900">
              <div className="font-semibold flex items-center space-x-1 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Validation Notices:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                {uploadResult.quality_report.warnings.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => handleProcess(uploadResult.dataset.id)}
              className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer"
            >
              Process & Compute Drought Indices Now
            </button>
          </div>
        </div>
      )}

      {/* Dataset Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Registered Environmental Datasets</h3>
          <span className="text-xs text-slate-400">{datasets.length} datasets stored</span>
        </div>

        {datasets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Dataset Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Rows</th>
                  <th className="py-2.5 px-3">Date Range</th>
                  <th className="py-2.5 px-3">Validation</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {datasets.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">{d.name}</td>
                    <td className="py-3 px-3">{d.file_type}</td>
                    <td className="py-3 px-3">{d.row_count}</td>
                    <td className="py-3 px-3 text-slate-500">
                      {d.date_range_start && d.date_range_end
                        ? `${d.date_range_start} to ${d.date_range_end}`
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                          d.validation_status === 'VALID'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {d.validation_status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                          d.processing_status === 'PROCESSED'
                            ? 'bg-teal-50 text-teal-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {d.processing_status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => handlePreview(d.id)}
                        title="Preview Records"
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleProcess(d.id)}
                        title="Process & Calculate Indices"
                        className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModalId(d.id)}
                        title="Delete Dataset"
                        className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No datasets uploaded. Upload a CSV/Excel file or click &ldquo;Load Synthetic Demo Dataset&rdquo;.
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Preview: {previewModal.name}</h3>
              <button
                onClick={() => setPreviewModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-auto flex-1 border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold sticky top-0 border-b border-slate-200">
                  <tr>
                    {previewModal.columns.map((col, idx) => (
                      <th key={idx} className="py-2 px-3 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {previewModal.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50">
                      {previewModal.columns.map((col, cIdx) => (
                        <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
                          {row[col] !== undefined ? String(row[col]) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 text-base">Confirm Dataset Deletion</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to permanently delete this dataset? All associated environmental records and calculated indices will be removed from the database.
            </p>
            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
