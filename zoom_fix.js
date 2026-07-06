/* =========================================================
   AI健康カルテ Ver.12.2.2
   iPhoneピンチズーム・ダブルタップズーム防止
   script.js の一番下に追加
   ========================================================= */

document.addEventListener("gesturestart", function(e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener("gesturechange", function(e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener("gestureend", function(e) {
  e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener("touchend", function(e) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });
