"use strict";

// 이전 포트폴리오에서 공유한 북마크를 같은 내용의 새 위치로 이어 준다.
const destinations = {
  projects: "details.html#projects",
  cases: "details.html#cases",
  grader: "details.html#grader",
  service: "details.html#service",
  camp: "details.html#camp",
  try: "demos.html#try",
  "role-demo": "demos.html#tt1",
  tt1: "demos.html#tt1",
  tt2: "demos.html#tt2",
  tt3: "demos.html#tt3",
  tt4: "demos.html#tt4",
  career: "career.html#career",
  edu: "career.html#edu",
  stack: "practice.html#stack",
  ways: "practice.html#ways",
  glance: "index.html#glance",
  contact: "index.html#contact"
};
function followBookmark() {
  const id = location.hash.slice(1);
  if (Object.hasOwn(destinations, id) && !document.getElementById(id)) {
    location.replace(destinations[id]);
  }
}
followBookmark();
window.addEventListener("hashchange", followBookmark);
