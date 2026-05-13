
const AboutUs = () => {
    return (
        <div className="w-full min-h-screen py-16 px-4 bg-background mt-[100px]">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-center mb-12 text-foreground">เกี่ยวกับเรา (About Us)</h1>
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">แพลตฟอร์มของเรา</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        ยินดีต้อนรับสู่แพลตฟอร์มของเรา แพลตฟอร์มนี้ถูกสร้างขึ้นมาเพื่อเชื่อมโยงนักศึกษาที่มีไอเดียสร้างสรรค์และนวัตกรรมใหม่ๆ (Pioneer) กับผู้สนับสนุนที่ต้องการเห็นไอเดียเหล่านั้นกลายเป็นจริง (Booster)
                    </p>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">วิสัยทัศน์ของเรา</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        เรามุ่งหวังที่จะเป็นส่วนหนึ่งในการขับเคลื่อนนวัตกรรมและเทคโนโลยีใหม่ๆ โดยการสนับสนุนให้นักศึกษาได้มีโอกาสสร้างสรรค์ผลงานและนำไปใช้ได้จริง สร้างผลกระทบเชิงบวกต่อสังคม
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
