import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const HelpCenter = () => {
    return (
        <div className="w-full min-h-screen py-16 px-4 bg-background mt-[100px]">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-center mb-12 text-foreground">ศูนย์ช่วยเหลือ (Help Center)</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-foreground">คำถามที่พบบ่อย (FAQ)</h2>
                        <div className="space-y-4">
                            <details className="group border-b border-border pb-4">
                                <summary className="font-medium cursor-pointer text-foreground hover:text-primary transition-colors">ฉันจะเริ่มสร้างโปรเจกต์ได้อย่างไร?</summary>
                                <p className="mt-2 text-muted-foreground text-sm">คุณสามารถเริ่มสร้างโปรเจกต์ได้โดยการสมัครสมาชิกในฐานะ Pioneer และคลิกที่ปุ่ม "สร้างโปรเจกต์" ในหน้าแดชบอร์ด</p>
                            </details>
                            <details className="group border-b border-border pb-4">
                                <summary className="font-medium cursor-pointer text-foreground hover:text-primary transition-colors">การสนับสนุนโปรเจกต์ทำงานอย่างไร?</summary>
                                <p className="mt-2 text-muted-foreground text-sm">ในฐานะ Booster คุณสามารถเลือกโปรเจกต์ที่สนใจและให้การสนับสนุนทางการเงิน โดยจะได้รับผลตอบแทนตามเงื่อนไขของโปรเจกต์</p>
                            </details>
                            <details className="group border-b border-border pb-4">
                                <summary className="font-medium cursor-pointer text-foreground hover:text-primary transition-colors">มีค่าธรรมเนียมในการใช้งานหรือไม่?</summary>
                                <p className="mt-2 text-muted-foreground text-sm">การสมัครสมาชิกและเข้าใช้งานแพลตฟอร์มนั้นฟรี จะมีค่าธรรมเนียมเฉพาะเมื่อมีการทำธุรกรรมทางการเงินเท่านั้น</p>
                            </details>
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-foreground">ติดต่อเรา</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-full text-primary">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">อีเมล</h3>
                                    <p className="text-muted-foreground">support@flyup.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-full text-primary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">โทรศัพท์</h3>
                                    <p className="text-muted-foreground">02-XXX-XXXX</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-full text-primary">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">ที่อยู่</h3>
                                    <p className="text-muted-foreground">มหาวิทยาลัยราชภัฏนครปฐม<br />85 ถ.มาลัยแมน อ.เมือง จ.นครปฐม 73000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
