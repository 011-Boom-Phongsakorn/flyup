import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, AlertTriangle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { AxiosError } from 'axios';

const CANCEL_REASONS = [
  'เปลี่ยนแปลงแผนธุรกิจ',
  'ปัญหาด้านทีม',
  'ปัญหาด้านเทคนิค',
  'สถานการณ์ส่วนตัว',
  'ไม่สามารถดำเนินการต่อได้ตามแผน',
  'อื่นๆ',
];

const CancelProjectRequest = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error('กรุณาเลือกเหตุผลที่ต้องการยกเลิก');
      return;
    }
    if (!details.trim()) {
      toast.error('กรุณาระบุรายละเอียดเพิ่มเติม');
      return;
    }
    if (details.trim().length < 20) {
      toast.error('กรุณาระบุรายละเอียดอย่างน้อย 20 ตัวอักษร');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.patch(`/pioneer/projects/${projectId}/submit-cancel`, {
        reason: `${selectedReason}: ${details.trim()}`,
      });
      toast.success('ส่งคำขอยกเลิกเรียบร้อยแล้ว รอ Admin พิจารณา');
      navigate('/pioneer/dashboard/projects');
    } catch (error) {
      const msg = error instanceof AxiosError ? error.response?.data?.message : null;
      if (msg === 'cancel request is already pending') {
        toast.error('คุณได้ส่งคำขอยกเลิกไปแล้ว กรุณารอ Admin พิจารณา');
      } else if (msg === 'project is already cancelled or state is draft') {
        toast.error('ไม่สามารถส่งคำขอได้ เนื่องจากโปรเจกต์ถูกยกเลิกแล้ว หรืออยู่ในสถานะแบบร่าง');
      } else {
        toast.error(msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/pioneer/dashboard/projects')}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} /> กลับ
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">ส่งคำขอยกเลิกโปรเจกต์</h1>
        <p className="text-sm text-muted-foreground mt-1">
          คำขอจะถูกส่งให้ Admin พิจารณา ระยะเวลาดำเนินการ 3–5 วันทำการ
        </p>
      </div>

      {/* Warning Banner */}
      <div className="flex gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
        <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-red-700">โปรดอ่านก่อนส่งคำขอ</p>
          <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
            <li>การยกเลิกโปรเจกต์จะต้องได้รับการอนุมัติจาก Admin</li>
            <li>Booster ที่ลงทุนอยู่จะได้รับการคืนเงินตามเงื่อนไข</li>
            <li>หากโปรเจกต์ถูกยกเลิก คุณอาจไม่สามารถสร้างโปรเจกต์ใหม่ได้ในระยะเวลาหนึ่ง</li>
          </ul>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-6">

        {/* Reason Select */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">
            เหตุผลที่ต้องการยกเลิก <span className="text-error">*</span>
          </label>
          <div className="flex flex-col gap-2">
            {CANCEL_REASONS.map(reason => (
              <label key={reason} className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setSelectedReason(reason)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${selectedReason === reason ? 'border-red-500' : 'border-border'}`}
                >
                  {selectedReason === reason && (
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  )}
                </div>
                <span className="text-sm text-foreground">{reason}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">
            รายละเอียดเพิ่มเติม <span className="text-error">*</span>
          </label>
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="อธิบายสถานการณ์และเหตุผลโดยละเอียด เพื่อให้ Admin พิจารณาได้อย่างถูกต้อง..."
            rows={5}
            className="border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition-colors resize-none"
          />
          <p className={`text-xs text-right ${details.trim().length < 20 ? 'text-muted-foreground' : 'text-green-600'}`}>
            {details.trim().length} / 20 ตัวอักษรขั้นต่ำ
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors cursor-pointer"
        >
          <Send size={16} />
          {isSubmitting ? 'กำลังส่งคำขอ...' : 'ส่งคำขอยกเลิก'}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          หากมีข้อสงสัย ติดต่อทีมสนับสนุนได้ที่ support@flyup.com
        </p>
      </div>
    </div>
  );
};

export default CancelProjectRequest;
