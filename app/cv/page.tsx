import Header from "@/components/Header";
export const metadata = { title: "CV | Prannav" };
export default function CV() {
  return (
    <>
      <Header />
      <main className="pg"><div className="wrap">
        <div className="cta" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <a className="back" href="/#cv">← Back</a>
          <a className="btn pri" href="/Prannav_K_B_CV.pdf" download>Download PDF</a>
        </div>
        <iframe className="cvview" src="/Prannav_K_B_CV.pdf#view=FitH" title="Prannav's CV" />
        <p className="note">Can't see the preview? <a href="/Prannav_K_B_CV.pdf" target="_blank" style={{ textDecoration: "underline" }}>Open the PDF directly</a>.</p>
      </div></main>
    </>
  );
}
