'use client';
import React, { useEffect, useState } from 'react';
import { Upload, Globe, Lock, Crown, Link as LinkIcon, Eye, Copy, Trash2, Loader2, CheckCircle2, Check, User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import uploadData from '@/data/upload.json';
import { toast } from 'sonner';
import { createClient } from '@/utils/client';
// Interface sesuai SearchPage
interface UploadedFile {
    id: number;
    name: string;
    size: string;
    link: string;
    uploadDate: string;
    expiryDate: string;
    content: string;
    isBookmarked?: boolean;
}

const STORAGE_KEY = "uploadedFiles";

const UploadPage = () => {
    const [selectedPlan, setSelectedPlan] = useState('free');
    const [selectedVisibility, setSelectedVisibility] = useState('public');
    const [file, setFile] = useState<File | null>(null);
    const [customFileName, setCustomFileName] = useState('');
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false); // Modal untuk hasil
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [userQuota, setUserQuota] = useState({ uses: 0, max: 2147483648 });
    const [resultLink, setResultLink] = useState<UploadedFile | null>(null);
    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setCustomFileName(selectedFile.name.split('.')[0]);
        }
    };

    useEffect(() => {
        const fetchQuota = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('user_quotas')
                    .select('current_usage_bytes, max_size_bytes')
                    .eq('user_id', user.id)
                    .single();
                if (data) setUserQuota({ uses: data.current_usage_bytes, max: data.max_size_bytes });
            }
        };
        fetchQuota();
    }, []);

    const handleCopy = async (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
                return;
            } catch (err) { }
        }
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const processUpload = async () => {
        if (!file) return;
        setIsConfigModalOpen(false);
        setIsLoading(true);

        try {
            // 1. Cek User
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error("Silakan login terlebih dahulu");

            // 2. Ambil Quota (Pastikan tabelnya 'user_quotas')
            const { data: quota, error: quotaError } = await supabase
                .from('user_quotas')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (quotaError) throw new Error("Gagal mengambil data kuota");

            // 3. Cek sisa memori
            if (quota.current_usage_bytes + file.size > quota.max_size_bytes) {
                toast.error("Kuota Penyimpanan Anda Penuh");
                setIsLoading(false);
                return;
            }

            // 4. Persiapan Path File
            const fileExt = file.name.split('.').pop();
            const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${user.id}/${cleanFileName}`;

            // 5. Upload ke Storage (Langsung supabase.storage)
            const { error: uploadError } = await supabase.storage
                .from('user-files')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 6. Simpan Metadata ke Database
            const shortCode = Math.random().toString(36).substring(2, 8);
            const { data: dbData, error: dbError } = await supabase
                .from('files')
                .insert({
                    user_id: user.id,
                    file_name: `${customFileName}.${fileExt}`,
                    file_size: file.size,
                    storage_path: filePath,
                    visibility: selectedVisibility,
                    short_link_code: shortCode
                })
                .select()
                .single();

            if (dbError) throw dbError;

            // 7. Tampilkan Hasil
            const newFileData: UploadedFile = {
                id: dbData.id,
                name: dbData.file_name,
                size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                link: `${window.location.origin}/preview/${shortCode}`,
                uploadDate: new Date().toLocaleDateString('id-ID'),
                expiryDate: selectedPlan === 'free' ? "24 Jam" : "Tak Terbatas",
                content: `File ${selectedVisibility}`,
            };

            setResultLink(newFileData);
            setFile(null);
            setIsResultModalOpen(true);
            toast.success("File berhasil diunggah!");

        } catch (error: any) {
            console.error("Detail Error:", error);
            toast.error(error.message || "Terjadi kesalahan saat upload");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 font-sans -mt-20">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">{uploadData.title}</h1>
                <p className="text-slate-500 font-medium">{uploadData.subtitle}</p>
            </div>

            <Card className="w-full max-w-3xl border-2 rounded-3xl border-foreground bg-white overflow-hidden">
                <CardContent className="p-6 md:p-8">
                    <div className="relative group cursor-pointer">
                        <div className={`border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center text-center ${file ? 'border-green-500 bg-green-50' : 'border-[#296374] bg-[#296374]/10 hover:bg-[#296374]/20'}`}>
                            <div className={`${file ? 'bg-green-500' : 'bg-[#296374]'} p-3 rounded-full mb-3 shadow-lg`}>
                                {file ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Upload className="w-6 h-6 text-white" />}
                            </div>
                            <p className="text-lg font-medium text-slate-700">
                                {file ? file.name : <span>Drag file(s) or <span className="text-[#296374] font-semibold underline">browse</span></span>}
                            </p>
                        </div>
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Select Plan</label>
                            <div className="space-y-3">
                                {uploadData.plans.map((plan) => (
                                    <label key={plan.id} className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <input type="radio" name="plan" checked={selectedPlan === plan.id} onChange={() => setSelectedPlan(plan.id)} className="accent-[#296374]" />
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-700 font-medium flex items-center gap-1">{plan.name} {plan.isPremium && <Crown className="w-3.5 h-3.5 text-amber-500" />}</span>
                                                <span className="text-[11px] text-slate-400">Kapasitas: {plan.storage}</span>
                                            </div>
                                        </div>
                                        <span className="text-sm text-slate-500">{plan.duration}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Visibility</label>
                            <div className="space-y-3">
                                {uploadData.visibilityOptions.map((opt, i) => (
                                    <label key={i} className="flex items-start gap-2 cursor-pointer">
                                        <input type="radio" name="visibility" checked={selectedVisibility === opt.label.toLowerCase()} onChange={() => setSelectedVisibility(opt.label.toLowerCase())} className="mt-1 accent-[#296374]" />
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                                {opt.label === 'Public' ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} {opt.label}
                                            </div>
                                            <span className="text-[11px] text-slate-500 leading-tight">({opt.description})</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button
                        disabled={!file || isLoading}
                        onClick={() => setIsConfigModalOpen(true)}
                        className="w-full mt-6 py-6 rounded-xl border-foreground bg-[#296374] hover:bg-[#1e4a57] text-white font-bold text-lg"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LinkIcon className="w-5 h-5 mr-2" />}
                        {isLoading ? "Generating Link..." : "Make Link"}
                    </Button>
                </CardContent>
            </Card>

            {/* MODAL 1: KONFIGURASI */}
            <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader><DialogTitle>Konfigurasi File</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nama Preview File</label>
                            <Input value={customFileName} onChange={(e) => setCustomFileName(e.target.value)} placeholder="Nama file..." />
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Syarat & Ketentuan</p>
                            <p className="text-[12px] text-slate-600 leading-relaxed italic">
                                Dengan melanjutkan, saya menyatakan secara sadar bahwa file yang diunggah tidak mengandung malware, virus, atau konten berbahaya lainnya yang melanggar hukum. Saya bertanggung jawab penuh atas seluruh isi dokumen ini.
                            </p>
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox id="terms" checked={isAgreed} onCheckedChange={(val) => setIsAgreed(val as boolean)} />
                                <label htmlFor="terms" className="text-xs font-medium cursor-pointer">Saya setuju</label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsConfigModalOpen(false)}>Batal</Button>
                        <Button disabled={!isAgreed || !customFileName} onClick={processUpload} className="bg-[#296374]">Konfirmasi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL 2: HASIL LINK (Card di dalam Modal) */}
            <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader><DialogTitle>Link Ready!</DialogTitle></DialogHeader>
                    {resultLink && (
                        <div className="p-4 bg-teal-50 border-2 border-teal-100 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-teal-600 p-2 rounded-lg text-white"><Eye className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{resultLink.name}</p>
                                    <p className="text-[10px] text-teal-600 font-medium uppercase">Ready to Preview</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="icon" variant="outline" className="h-8 w-8 rounded-md" onClick={() => handleCopy(resultLink.link)}>
                                    {isCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </Button>
                                <Button size="icon" variant="outline" onClick={() => setIsResultModalOpen(false)} className="h-8 w-8 rounded-md text-red-500 hover:bg-red-50">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    )}
                    <Button className="w-full bg-slate-900 text-white" onClick={() => setIsResultModalOpen(false)}>Tutup</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UploadPage;