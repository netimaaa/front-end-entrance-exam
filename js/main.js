document.addEventListener("DOMContentLoaded", () => {
  const photoInput = document.getElementById("photoInput");
  const photoImg = document.querySelector(".header-box.photo");

  const savedPhoto = localStorage.getItem("profilePhoto");
  if (savedPhoto) {
    photoImg.src = savedPhoto;
  }

  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
      photoImg.src = ev.target.result;
      localStorage.setItem("profilePhoto", ev.target.result);
    };
    reader.readAsDataURL(file);
  });

  const editableElements = document.querySelectorAll("[contenteditable]");
  editableElements.forEach((el, idx) => {
    if (!el.hasAttribute("data-default")) {
      el.setAttribute("data-default", el.innerHTML);
    }

    const key = "editable-" + idx;
    const saved = localStorage.getItem(key);
    if (saved) {
      el.innerHTML = saved;
    }

    el.addEventListener("input", () => {
      localStorage.setItem(key, el.innerHTML);
    });
  });

  document.querySelectorAll(".hidden-range").forEach((input) => {
    const progress = input.previousElementSibling;

    const update = () => {
      const percent =
        ((input.value - input.min) / (input.max - input.min)) * 100;
      progress.style.width = `${percent}%`;

      const langName = input
        .closest(".languages-item")
        .querySelector(".languages-text")
        .textContent.trim();
      localStorage.setItem(`language-${langName}`, input.value);
    };

    input.addEventListener("input", update);

    const langName = input
      .closest(".languages-item")
      .querySelector(".languages-text")
      .textContent.trim();
    const savedVal = localStorage.getItem(`language-${langName}`);
    if (savedVal !== null) {
      input.value = savedVal;
    }
    update();
  });

  const resetBtn = document.getElementById("resetBtn");
  resetBtn?.addEventListener("click", () => {
    editableElements.forEach((el, idx) => {
      const def = el.getAttribute("data-default") || "";
      el.innerHTML = def;
      localStorage.removeItem("editable-" + idx);
    });

    const defaultValues = {
      English: 100,
      Malayalam: 100,
      Hindi: 77,
    };

    document.querySelectorAll(".hidden-range").forEach((input) => {
      const langName = input
        .closest(".languages-item")
        .querySelector(".languages-text")
        .textContent.trim();

      if (Object.prototype.hasOwnProperty.call(defaultValues, langName)) {
        input.value = defaultValues[langName];
        localStorage.setItem(`language-${langName}`, input.value);

        const percent =
          ((input.value - input.min) / (input.max - input.min)) * 100;
        const progress = input.previousElementSibling;
        progress.style.width = `${percent}%`;
      }
    });

    localStorage.removeItem("profilePhoto");
    photoImg.src = "./public/profileImg.jpg";
    photoInput.value = "";
  });

  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn?.addEventListener("click", async () => {
    const element = document.getElementById("app");
    const overlay = document.querySelector(".photo-overlay");

    overlay.style.display = "none";

    const html2pdfScriptUrl =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";

    if (typeof html2pdf === "undefined") {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = html2pdfScriptUrl;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }

    const opt = {
      margin: 0.3,
      filename: "CV.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(element).save();

    overlay.style.display = "";
  });

  document.addEventListener("click", function (e) {
    const target = e.target.closest(".ripple-container");
    if (!target) return;

    const ripple = document.createElement("span");
    ripple.className = "ripple";

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;

    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    target.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  });
});
