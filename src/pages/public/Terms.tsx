import { FileText, Shield, AlertTriangle, Scale } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const Terms = () => {
  useSEO({
    title: 'ข้อกำหนดและเงื่อนไข',
    description: 'ข้อกำหนดและเงื่อนไขการใช้งานแพลตฟอร์ม FlyUp สำหรับนักลงทุนและนักศึกษา',
    url: '/legal/terms',
  });
    return (
        <div className="w-full min-h-screen pt-32 pb-20 px-4 bg-background">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground">ข้อกำหนดและเงื่อนไข</h1>
                    <p className="text-lg text-muted-foreground">ข้อตกลงในการใช้งานแพลตฟอร์ม FlyUp (Terms & Conditions)</p>
                </div>

                <div className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-sm space-y-10">
                    <div className="p-4 bg-primary/10 rounded-xl text-primary text-sm leading-relaxed">
                        <strong>อัปเดตล่าสุด:</strong> 26 พฤษภาคม 2026<br />
                        โปรดอ่านข้อกำหนดและเงื่อนไขเหล่านี้อย่างละเอียดก่อนใช้บริการของเรา การเข้าถึงและการใช้บริการของคุณหมายถึงคุณยอมรับที่จะผูกพันตามข้อกำหนดเหล่านี้
                    </div>

                    <div className="space-y-12">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                                <FileText className="text-primary" /> 1. การยอมรับข้อตกลง
                            </h2>
                            <div className="text-muted-foreground leading-relaxed pl-10 space-y-4">
                                <p>การเข้าถึงหรือใช้งานแพลตฟอร์มนี้ ถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขการใช้งานเหล่านี้ทั้งหมด หากคุณไม่เห็นด้วยกับส่วนใดส่วนหนึ่งของข้อกำหนดเหล่านี้ คุณจะไม่สามารถเข้าถึงแพลตฟอร์มหรือใช้บริการได้</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                                <Scale className="text-primary" /> 2. บทบาทและหน้าที่ของผู้ใช้
                            </h2>
                            <div className="text-muted-foreground leading-relaxed pl-10 space-y-4">
                                <div>
                                    <h3 className="font-bold text-foreground mb-1">2.1 Pioneer (ผู้สร้างโปรเจกต์)</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>ต้องเป็นนักศึกษาที่มีสถานะใช้งานอยู่ และสามารถยืนยันตัวตนด้วยบัตรนักศึกษาได้</li>
                                        <li>ข้อมูลโปรเจกต์ที่นำเสนอต้องเป็นความจริง และผลงานที่สร้างสรรค์ต้องไม่ละเมิดลิขสิทธิ์ของผู้อื่น</li>
                                        <li>มีหน้าที่ส่งมอบงานตาม Milestone ที่ระบุไว้ หากไม่สามารถทำได้ ต้องแจ้งแก้ไขให้ชัดเจน</li>
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-bold text-foreground mb-1">2.2 Booster (ผู้สนับสนุน)</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>ตระหนักว่าการระดมทุนมีความเสี่ยง และ FlyUp ไม่สามารถรับประกันผลสำเร็จของโปรเจกต์ได้ 100%</li>
                                        <li>การตัดสินใจลงทุนและการโหวตแต่ละ Milestone การตัดสินใจขึ้นอยู่กับดุลยพินิจของคุณ</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                                <AlertTriangle className="text-primary" /> 3. นโยบายการคืนเงิน (Refund Policy)
                            </h2>
                            <div className="text-muted-foreground leading-relaxed pl-10 space-y-4">
                                <p>สำหรับการทำงานที่ไม่เป็นไปตามเงื่อนไข ผู้สนับสนุนมีสิทธิ์เรียกร้องขอคืนเงินในส่วนของ Milestone ที่ยังไม่ได้ถูกโอนให้ผู้สร้างโปรเจกต์ ระบบจะไม่สามารถคืนเงินในส่วนที่ได้ผ่านการอนุมัติและโอนไปแล้วทางธุรกรรม</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                                <Shield className="text-primary" /> 4. ทรัพย์สินทางปัญญา
                            </h2>
                            <div className="text-muted-foreground leading-relaxed pl-10 space-y-4">
                                <p>ผลงานสร้างสรรค์และ Source Code ที่เกิดจากโปรเจกต์บนแพลตฟอร์มนี้ ลิขสิทธิ์เป็นของผู้สร้างโปรเจกต์ (Pioneer) แพลตฟอร์ม FlyUp จะไม่เรียกร้องสิทธิ์ความเป็นเจ้าของในผลงาน เว้นแต่จะมีข้อตกลงพิเศษที่ระบุไว้ร่วมกับนักลงทุน</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
