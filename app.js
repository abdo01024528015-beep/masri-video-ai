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

  // اختيار مدة الفيديو
  document.querySelectorAll(".duration").forEach((button) => {

    button.addEventListener("click", () => {

      document.querySelectorAll(".duration").forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      selectedDuration = button.dataset.value;

    });

  });


  // اختيار أبعاد الفيديو
  document.querySelectorAll(".ratio").forEach((button) => {

    button.addEventListener("click", () => {

      document.querySelectorAll(".ratio").forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      selectedRatio = button.dataset.value;

    });

  });


  // رفع ومعاينة الصورة
  if (imageInput) {

    imageInput.addEventListener("change", (event) => {

      const file = event.target.files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {

        const uploadBox = document.querySelector(".upload");

        if (uploadBox) {

          uploadBox.innerHTML = `
            <img
              src="${e.target.result}"
              alt="الصورة المرجعية"
              style="
                width:100%;
                height:100%;
                object-fit:contain;
              "
            >
          `;

        }

      };

      reader.readAsDataURL(file);

    });

  }


  // زر إنشاء الفيديو
  if (generateButton) {

    generateButton.addEventListener("click", () => {

      const prompt = promptInput
        ? promptInput.value.trim()
        : "";

      // التأكد من وجود Prompt
      if (!prompt) {

        if (statusBox) {

          statusBox.style.display = "block";

          statusBox.innerHTML = `
            ⚠️ من فضلك اكتب فكرة الفيديو أولًا.
          `;

        }

        return;

      }


      // إظهار حالة التشغيل
      if (statusBox) {

        statusBox.style.display = "block";

        statusBox.innerHTML = `
          ⏳ جاري تجهيز طلب الفيديو...
          <br>
          <small>المدة: ${selectedDuration} ثانية</small>
          <br>
          <small>المقاس: ${selectedRatio}</small>
        `;

      }


      // إظهار النتيجة التجريبية
      if (resultBox) {

        resultBox.innerHTML = `
          <div style="
            margin-top:20px;
            padding:20px;
            border-radius:15px;
            background:#151b2b;
            border:1px solid #30394d;
            text-align:center;
          ">

            <div style="font-size:40px;">
              🎬
            </div>

            <h3 style="margin:10px 0;">
              تم استلام طلبك ✅
            </h3>

            <p style="
              color:#aeb6c5;
              line-height:1.7;
            ">
              ${escapeHTML(prompt)}
            </p>

            <p style="
              color:#8f88ff;
              margin-top:10px;
            ">
              محرك توليد الفيديو سيتم توصيله في الخطوة القادمة.
            </p>

          </div>
        `;

      }


      // عرض البيانات في Console للتجربة
      console.log({
        prompt: prompt,
        duration: selectedDuration,
        ratio: selectedRatio,
        language: "Arabic",
        dialect: "Egyptian"
      });

    });

  }

});


// حماية النص الذي يكتبه المستخدم
function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}