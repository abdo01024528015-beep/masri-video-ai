// Masri Video AI
// Front-end controller

document.addEventListener("DOMContentLoaded", () => {

  let selectedDuration = "30";
  let selectedRatio = "9:16";

  const promptInput = document.getElementById("prompt");
  const imageInput = document.getElementById("image");
  const statusBox = document.getElementById("status");
  const resultBox = document.getElementById("result");
  const generateButton = document.getElementById("generate");

  // مدة الفيديو
  document.querySelectorAll(".duration").forEach((button) => {
    button.addEventListener("click", () => {

      document.querySelectorAll(".duration").forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      selectedDuration = button.dataset.value;
    });
  });

  // أبعاد الفيديو
  document.querySelectorAll(".ratio").forEach((button) => {
    button.addEventListener("click", () => {

      document.querySelectorAll(".ratio").forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      selectedRatio = button.dataset.value;
    });
  });

  // إنشاء الفيديو
  if (generateButton) {

    generateButton.addEventListener("click", async () => {

      const prompt = promptInput
        ? promptInput.value.trim()
        : "";

      if (!prompt) {
        statusBox.innerHTML = "⚠️ اكتب فكرة الفيديو أولًا.";
        return;
      }

      statusBox.innerHTML = "⏳ جاري إرسال الطلب إلى السيرفر...";

      resultBox.innerHTML = "";

      try {

        const response = await fetch(
          "http://localhost:3000/api/generate",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              prompt: prompt,
              duration: selectedDuration,
              ratio: selectedRatio
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "حدث خطأ");
        }

        statusBox.innerHTML = "✅ تم إرسال الطلب بنجاح.";

        resultBox.innerHTML = `
          <div style="
            margin-top:20px;
            padding:20px;
            border-radius:15px;
            background:#151b2b;
            border:1px solid #30394d;
            text-align:center;
          ">

            <div style="font-size:45px;">🎬</div>

            <h3>السيرفر استلم طلبك ✅</h3>

            <p>
              <strong>الفكرة:</strong><br>
              ${escapeHTML(data.prompt)}
            </p>

            <p>
              <strong>المدة:</strong>
              ${escapeHTML(String(data.duration))} ثانية
            </p>

            <p>
              <strong>المقاس:</strong>
              ${escapeHTML(data.ratio)}
            </p>

            <p style="color:#8f88ff;">
              الخطوة القادمة: تشغيل محرك توليد الفيديو 🤖
            </p>

          </div>
        `;

      } catch (error) {

        console.error(error);

        statusBox.innerHTML =
          "❌ لم نتمكن من الاتصال بالسيرفر.";

        resultBox.innerHTML = `
          <div style="
            margin-top:20px;
            padding:20px;
            border-radius:15px;
            background:#2a1515;
            text-align:center;
          ">
            تأكد أن السيرفر شغال على Port 3000.
          </div>
        `;
      }

    });

  }

});

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}