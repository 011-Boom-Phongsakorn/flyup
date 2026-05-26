import { Mail, Phone, MapPin, HelpCircle } from 'lucide-react';

const HelpCenter = () => {
    return (
        <div className="w-full min-h-screen pt-32 pb-20 px-4 bg-background">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground">ศูนย์ช่วยเหลือ</h1>
                    <p className="text-lg text-muted-foreground">มีอะไรให้เราช่วย? ค้นหาคำตอบหรือติดต่อทีมงาน FlyUp (Help Center)</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Contact Cards */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">อีเมลสนับสนุน</h3>
                                <p className="text-sm text-muted-foreground mt-1">support@fly-up.app</p>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center text-green-600">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">โทรศัพท์</h3>
                                <p className="text-sm text-muted-foreground mt-1">02-xxx-xxxx</p>
                                <p className="text-xs text-muted-foreground mt-1 text-green-600">จันทร์ - ศุกร์ (09:00 - 18:00)</p>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
                            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center text-orange-600">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">ที่ตั้งสำนักงาน</h3>
                                <p className="text-sm text-muted-foreground mt-1">มหาวิทยาลัยราชภัฏนครปฐม<br />85 ถ.มาลัยแมน อ.เมือง<br />จ.นครปฐม 73000</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="md:col-span-2 bg-card rounded-3xl p-8 border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <HelpCircle className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground">คำถามที่พบบ่อย (FAQ)</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                {
                                    q: "ฉันจะเริ่มสร้างโปรเจกต์ได้อย่างไร?",
                                    a: "คุณสามารถเริ่มสร้างโปรเจกต์ได้โดยการสมัครสมาชิกด้วยอีเมลมหาวิทยาลัย จากนั้นเลือก Role เป็น 'Pioneer' ยืนยันตัวตนด้วยบัตรนักศึกษา และคลิกเข้าสู่แดชบอร์ดเพื่อกด 'สร้างโปรเจกต์' ใหม่"
                                },
                                {
                                    q: "การสนับสนุนโปรเจกต์ในฐานะ Booster ทำงานอย่างไร?",
                                    a: "คุณสามารถเลือกโปรเจกต์ที่สนใจและให้การสนับสนุนทางการเงิน โดยในแต่ละโปรเจกต์จะมีการแบ่งรอบการจ่ายเงินตาม Milestone คุณจะได้สิทธิ์โหวตอนุมัติงานก่อนที่เงินจะถูกโอนไปให้ Pioneer"
                                },
                                {
                                    q: "มีค่าธรรมเนียมในการใช้งานหรือไม่?",
                                    a: "การสมัครสมาชิกและเข้าใช้งานแพลตฟอร์มนั้นฟรี จะมีค่าธรรมเนียมแพลตฟอร์ม (Platform Fee) หักจากยอดเงินที่ระดมทุนได้ เฉพาะโปรเจกต์ที่ระดมทุนสำเร็จและมีการอนุมัติโอนเงินเท่านั้น"
                                },
                                {
                                    q: "หากโปรเจกต์ไม่สำเร็จตามเป้า จะได้เงินคืนหรือไม่?",
                                    a: "ใช่ หากสิ้นสุดระยะเวลาระดมทุนแล้วได้ยอดไม่ถึงขั้นต่ำที่กำหนด เงินลงทุนทั้งหมดจะถูกคืนกลับไปยังบัญชีของ Booster อย่างครบถ้วน"
                                },
                                {
                                    q: "ใครเป็นคนประเมินงานแต่ละ Milestone?",
                                    a: "Admin จะเป็นผู้ตรวจสอบความถูกต้องเบื้องต้นก่อน จากนั้นจะเปิดให้ Booster ที่ลงทุนในโปรเจกต์นั้นเข้ามา 'โหวต' เพื่ออนุมัติผลงาน หากเสียงส่วนใหญ่อนุมัติ เงินงวดนั้นจึงจะถูกปล่อย"
                                }
                            ].map((faq, index) => (
                                <details key={index} className="group border border-border rounded-xl bg-background overflow-hidden">
                                    <summary className="font-bold flex justify-between items-center cursor-pointer p-5 text-foreground hover:bg-muted/50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                                        <div className="flex items-center gap-3">
                                            <span className="text-primary w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-sm">Q</span>
                                            {faq.q}
                                        </div>
                                        <span className="text-primary group-open:rotate-45 transition-transform duration-300 text-2xl font-light leading-none">+</span>
                                    </summary>
                                    <div className="p-5 pt-0 text-muted-foreground leading-relaxed border-t border-border/50 bg-muted/20">
                                        <div className="flex gap-3 pt-4">
                                            <span className="text-green-600 w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-sm font-bold flex-shrink-0">A</span>
                                            <p>{faq.a}</p>
                                        </div>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
