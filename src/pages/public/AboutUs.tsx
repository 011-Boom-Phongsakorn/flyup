import { Rocket, Target, Shield, Heart } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="w-full min-h-screen pt-32 pb-20 px-4 bg-background">
            <div className="max-w-5xl mx-auto space-y-16">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground">เกี่ยวกับ <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">FlyUp</span></h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        แพลตฟอร์มระดมทุนที่เชื่อมโยงนักศึกษาที่มีไอเดียสร้างสรรค์ กับผู้สนับสนุนที่ต้องการสานฝันให้เป็นจริง
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-3xl p-8 md:p-12 border border-border shadow-sm">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-semibold">
                            <Rocket size={18} /> จุดเริ่มต้นของเรา
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">จากโปรเจกต์นักศึกษา สู่ผลงานที่ใช้ได้จริง</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            เราเชื่อว่านักศึกษาเต็มไปด้วยไอเดียและศักยภาพ แต่หลายครั้งโปรเจกต์จบ หรือผลงานในห้องเรียน กลับจบลงแค่ในแฟ้มเอกสาร FlyUp เกิดขึ้นมาเพื่อแก้ปัญหานี้ โดยเปิดพื้นที่ให้นักศึกษา (Pioneer) ได้นำเสนอไอเดีย และให้นักลงทุน (Booster) ได้เข้ามาสนับสนุนเงินทุน
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl h-64 md:h-full flex items-center justify-center p-8">
                        <img src="/flyup-mascot.png" alt="FlyUp Mascot" className="max-h-full object-contain animate-float" />
                    </div>
                </div>

                {/* Core Values */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-center text-foreground">ค่านิยมหลักของเรา</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        <div className="bg-card p-6 rounded-2xl border border-border text-center space-y-4 hover:shadow-md transition-shadow">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-purple-600">
                                <Target size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">มุ่งเน้นผลลัพธ์ (Impact)</h3>
                            <p className="text-sm text-muted-foreground">ผลักดันให้เกิดซอฟต์แวร์ที่ใช้งานได้จริง และแก้ปัญหาได้ตรงจุด</p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border text-center space-y-4 hover:shadow-md transition-shadow">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-green-600">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">โปร่งใส (Transparency)</h3>
                            <p className="text-sm text-muted-foreground">ระบบ Milestone ที่ตรวจสอบผลงานได้ก่อนโอนเงิน มั่นใจทั้งผู้ให้และผู้รับ</p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border text-center space-y-4 hover:shadow-md transition-shadow">
                            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-pink-600">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">เติบโตไปด้วยกัน (Growth)</h3>
                            <p className="text-sm text-muted-foreground">สร้างชุมชนที่สนับสนุนซึ่งกันและกัน ให้นักศึกษาได้เรียนรู้จากประสบการณ์จริง</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
