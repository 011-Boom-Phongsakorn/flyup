import React from 'react';

const Terms = () => {
    return (
        <div className="w-full min-h-screen py-16 px-4 bg-background mt-[100px]">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-center mb-12 text-foreground">ข้อกำหนดและเงื่อนไข (Terms & Conditions)</h1>
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                        <p>
                            โปรดอ่านข้อกำหนดและเงื่อนไขเหล่านี้อย่างละเอียดก่อนใช้บริการของเรา การเข้าถึงและการใช้บริการของคุณหมายถึงคุณยอมรับที่จะผูกพันตามข้อกำหนดเหล่านี้
                        </p>

                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">1. การยอมรับข้อตกลง</h3>
                            <p>การเข้าถึงหรือใช้งานแพลตฟอร์มนี้ ถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขการใช้งานเหล่านี้ทั้งหมด</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">2. การใช้งานแพลตฟอร์ม</h3>
                            <p>ผู้ใช้งานตกลงที่จะใช้แพลตฟอร์มนี้อย่างถูกกฎหมายและไม่ละเมิดสิทธิของบุคคลที่สาม หรือขัดขวางการใช้งานแพลตฟอร์มของผู้ใช้อื่นๆ</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">3. ทรัพย์สินทางปัญญา</h3>
                            <p>เนื้อหาทั้งหมดบนแพลตฟอร์ม รวมถึงข้อความ กราฟิก โลโก้ และซอฟต์แวร์ เป็นทรัพย์สินของแพลตฟอร์มหรือผู้ให้อนุญาต และได้รับการคุ้มครองตามกฎหมายลิขสิทธิ์</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
