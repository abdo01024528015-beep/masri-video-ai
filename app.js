// Masri Video AI
// Front-end controller

let selectedDuration = "30";
let selectedRatio = "9:16";

// اختيار مدة الفيديو
document.querySelectorAll(".duration").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".duration").forEach((b) => {
      b.classList.remove("active");
    });

    button.classList.add("active");
    selectedDuration = button.dataset.value;
  });
});

// اختيار أبعاد الفيديو
document.querySelectorAll(".ratio").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".ratio").forEach((b) => {
      b.classList.remove("active");
    });

    button.classList.add("active");
    selectedRatio = button.dataset.value;
  });
});

// معاينة الصورة
const imageInput = document.getElementById("image");

if (imageInput) {
  imageInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const upload = document.querySelector(".upload");

      if (upload) {
        upload.innerHTML = `
          <img
            src="${e.target.result}"
            alt="الصورة المرجعية"
            style="width:100%;height:100%;object-fit:contain;"
          >
        `;
      }
    };

    reader.readAsDataURL(file);
  });
}

// إرسال طلب إنشاء الفيديو
async function generateVideo() {
  const promptElement = document.getElementById("prompt");
  const status = document.getElementById("status");

  const prompt = promptElement
    ? promptElement.value.trim()
    : "";

  if (!prompt) {
    alert("اكتب فكرة الفيديو الأول 💡");
    return;
  }

  if (status) {
    status.style.display = "block";
    status.innerHTML = "⏳ جاري تجهيز الفيديو...";
  }

  const requestData = {
    prompt: prompt,
    duration: Number(selectedDuration),
    ratio: selectedRatio,
    language: "ar",
    dialect: "egyptian"
  };

  console.log("Video request:", requestData);

  /*
    في المرحلة القادمة هنربط العنوان ده بالـBackend الحقيقي:

    POST /api/generate

    والـBackend هيقوم بـ:
    1. تحويل البرومبت إلى سيناريو.
    2. تقسيم السيناريو إلى مشاهد.
    3. توليد المشاهد.
    4. توليد الصوت باللهجة المصرية.
    5. تجميع المشاهد والصوت.
    6. إرجاع رابط الفيديو.
  */

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error("Backend unavailable");
    }

    const result = await response.json();

    if (result.video_url) {
      status.innerHTML = `
        ✅ الفيديو جاهز!<br><br>
        <a
          href="${result.video_url}"
          target="_blank"
          style="color:#8f88ff;font-weight:bold;"
        >
          ▶️ مشاهدة الفيديو
        </a>
      `;
    } else {
      throw new Error("No video URL");
    }

  } catch (error) {

    console.log(error);

    status.innerHTML = `
      ⚙️ الواجهة جاهزة لاستقبال محرك الذكاء الاصطناعي.
      <br><br>
      سيتم تشغيل التوليد الحقيقي بعد ربط الـBackend.
    `;
  }
}
