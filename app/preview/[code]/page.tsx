'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2, AlertCircle, FileX } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PDFDocument = dynamic(() => import('react-pdf').then(mod => mod.Document), { ssr: false });
const PDFPage = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });

export default function CleanPreviewPage() {
    const params = useParams();
    const [fileData, setFileData] = useState<any>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [textContent, setTextContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [pdfWorkerLoaded, setPdfWorkerLoaded] = useState(false);
    const [pdfWidth, setPdfWidth] = useState(800);

    // Hitung lebar PDF secara responsif
    const updatePdfWidth = useCallback(() => {
        const padding = 32; // 16px kiri + 16px kanan
        const maxWidth = 960;
        const available = window.innerWidth - padding;
        setPdfWidth(Math.min(available, maxWidth));
    }, []);

    useEffect(() => {
        updatePdfWidth();
        window.addEventListener('resize', updatePdfWidth);
        return () => window.removeEventListener('resize', updatePdfWidth);
    }, [updatePdfWidth]);

    useEffect(() => {
        const supabase = createClient();
        const shortCode = params.code as string;

        const setupWorker = async () => {
            try {
                const pdfjs = await import('react-pdf');
                pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
                setPdfWorkerLoaded(true);
            } catch (err) {
                console.error("Gagal memuat PDF Worker:", err);
            }
        };

        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('files')
                    .select('*')
                    .eq('short_link_code', shortCode)
                    .single();

                if (error) throw error;
                if (!data) throw new Error("Data tidak ditemukan");

                const ext = data.file_name.split('.').pop()?.toLowerCase();
                const { data: urlData } = supabase.storage.from('user-files').getPublicUrl(data.storage_path);

                if (['sql', 'txt', 'js', 'json'].includes(ext || '')) {
                    const { data: blob } = await supabase.storage.from('user-files').download(data.storage_path);
                    if (blob) setTextContent(await blob.text());
                }

                setFileData({ ...data, url: urlData.publicUrl });
            } catch (err: any) {
                console.error("Fetch Error:", err.message);
            } finally {
                setLoading(false);
            }
        };

        if (shortCode) {
            setupWorker();
            fetchData();
        }
    }, [params.code]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
                <Loader2 className="animate-spin text-[#296374] w-10 h-10" />
                <p className="text-slate-500 font-medium text-sm animate-pulse">Menyiapkan dokumen...</p>
            </div>
        );
    }

    if (!fileData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 px-4">
                <FileX className="text-red-400 w-14 h-14" />
                <h2 className="text-xl font-bold text-slate-700">File tidak ditemukan</h2>
                <p className="text-slate-400 text-sm text-center">Pastikan link yang kamu buka sudah benar.</p>
            </div>
        );
    }

    const fileExt = fileData.file_name.split('.').pop()?.toLowerCase();
    const isPDF = fileExt === 'pdf';
    const isText = ['sql', 'js', 'txt', 'json'].includes(fileExt || '');

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h1
                        className="text-sm sm:text-base font-bold text-slate-800 truncate uppercase italic tracking-tight"
                        title={fileData.file_name}
                    >
                        {fileData.file_name}
                    </h1>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold uppercase tracking-wider text-slate-500">
                            Preview Mode
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                            {(fileData.file_size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="w-full max-w-5xl mx-auto px-4 py-6 pb-24">

                {/* PDF Viewer */}
                {isPDF && pdfWorkerLoaded && (
                    <div className="flex flex-col items-center gap-6">
                        <PDFDocument
                            file={fileData.url}
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            onLoadError={(err) => console.error("PDF Load Error:", err)}
                            loading={
                                <div className="flex items-center gap-2 py-10 text-slate-400">
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    <span className="text-sm">Memuat PDF...</span>
                                </div>
                            }
                        >
                            {Array.from(new Array(numPages), (_, index) => (
                                <div
                                    key={`page_${index + 1}`}
                                    className="w-full bg-white shadow-lg rounded-sm overflow-hidden mb-4"
                                    style={{ maxWidth: pdfWidth }}
                                >
                                    <PDFPage
                                        pageNumber={index + 1}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                        width={pdfWidth}
                                    />
                                </div>
                            ))}
                        </PDFDocument>
                        {numPages > 0 && (
                            <p className="text-xs text-slate-400 font-medium">{numPages} halaman</p>
                        )}
                    </div>
                )}

                {/* PDF loading worker */}
                {isPDF && !pdfWorkerLoaded && (
                    <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
                        <Loader2 className="animate-spin w-5 h-5" />
                        <span className="text-sm">Memuat PDF viewer...</span>
                    </div>
                )}

                {/* Text / Code Viewer */}
                {isText && (
                    <div className="rounded-xl overflow-hidden shadow-xl border border-slate-800 w-full">
                        <div className="bg-[#1e1e1e] px-4 py-2 flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-mono">{fileData.file_name}</span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{fileExt}</span>
                        </div>
                        <SyntaxHighlighter
                            language={fileExt === 'sql' ? 'sql' : fileExt === 'json' ? 'json' : 'javascript'}
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: '24px',
                                fontSize: '13px',
                                lineHeight: '1.7',
                                background: '#1e1e1e',
                                overflowX: 'auto',
                            }}
                            showLineNumbers={true}
                            wrapLongLines={false}
                        >
                            {textContent}
                        </SyntaxHighlighter>
                    </div>
                )}

                {/* Unsupported format */}
                {!isPDF && !isText && (
                    <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">Format file ini tidak mendukung preview langsung.</p>
                        <p className="text-slate-300 text-xs mt-1">Format: .{fileExt}</p>
                    </div>
                )}
            </div>
        </div>
    );
}