"use strict";

const copyButton = document.getElementById("copy-mail");
if (navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    const email = document.querySelector(".email").textContent;
    const status = document.getElementById("copy-status");
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = "이메일 주소를 복사했습니다.";
    } catch {
      status.textContent = "이메일 주소를 선택해 복사해 주세요.";
    }
  });
}
