// const wrapper = document.querySelector(".wrapper");
// const form = document.querySelector("form");
// const fileInp = document.querySelector(".fileInp");
// const infoText = document.querySelector("p");
// const closeBtn = document.querySelector(".close");
// const copyBtn = document.querySelector(".copy");
// const textArea = document.querySelector("textarea")

// const qrCodeApiUrl = "https://api.qrserver.com/v1/read-qr-code/";

// // file과 formData 받는 함수
// // file : 업로드할 파일, formData : file을 포함한 다른 데이터를 담는 FormData객체
// function fetchRequest(file, formData) {
//     infoText.innerText = "Scanning QR Code...";
//     // QR 코드를 스캔하는 API에 POST 요청
//     fetch( qrCodeApiUrl, {
//         method: 'POST', 
//         body: formData,
//     })
//     .then(res => res.json())
//     .then(result => {
//         result = result[0].symbol[0].data;
//         // HTML 요소 내용 설정
//         infoText.innerText = result 
//             ? "Upload QR Code To Scan" 
//             : "Couldn't Scan QR Code";
//         if (!result) return;
//         // 스캔 결과가 있을경우 페이지 내의 textarea 요소에 설정하여 사용자에게 표시
//         document.querySelector("textarea").innerText = result;
//         // img요소의 src 속성을 file에 대한 URL로 설정(업로드한 QR코드 이미지 보여주기)
//         form.querySelector("img").src = URL.createObjectURL(file);
//         // QR코드 스캔이 성공적으로 실행되었을때 활성화 시킴
//         wrapper.classList.add("active");
//     })
//     .catch(() => {
//         infoText.innerText = "Couldn't Scan QR Code...";
//     });
// }

// // 이미지 파일을 서버로 보내어 QR 코드를 스캔하고 스캔 결과를 화면에 표시하는 기능
// // 파일 입력 요소의 값이 변경 되었을 때 실행
// fileInp.addEventListener("change", async e => {
//     // 선택된 파일 객체를 가져옴 (업로드할 QR코드 이미지)
//     let file = e.target.files[0];
//     if (!file) return;
//     // FormData 객체를 생성 -> 폼 데이터를 쉽게 생성하고 서버로 보낼 수 있는 방법 제공
//     let formData = new FormData();
//     // file을 FormData 객체에 첨부
//     // 서버로 보낼 요청의 본문에 파일을 첨부하는 과정
//     formData.append("file", file);
//     // QR코드 스캔을 처리하고 스캔 결과를 화면에 표시
//     fetchRequest(file, formData);
// });

// // 복사버튼 클릭시 특정 텍스트를 복사하는 기능
// copyBtn.addEventListener("click", () => {
//     let text = document.querySelector("textarea").textContent;
//     copyBtn.innerText="Copied!"
//     navigator.clipboard.writeText(text);
// });

// // form요소 클릭시 fileInp 이벤트 리스너 함수 호출
// form.addEventListener("click", () => fileInp.click());
// // closeBtn 클릭시 wrapper.active 클래스 제거
// closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));

const wrapper = document.querySelector(".wrapper");
const form = document.querySelector("form");
// generator.js의 input값과 겹침
const fileInp = document.querySelector(".fileInp");
// const fileInp = document.querySelector("input");
const infoText = document.querySelector("p");
const closeBtn = document.querySelector(".close");
const copyBtn = document.querySelector(".copy");
const textArea = document.querySelector("textarea");

// HTTPS를 지원하는 QR 코드 리더 API를 사용하는 예시
const qrCodeApiUrl = "https://api.qrserver.com/v1/read-qr-code/";
// 브라우저는 보안상의 이유로 "혼합 콘텐츠"를 차단하며, HTTPS에서도 HTTPS리소스만 허용합니다.

// To fetch file, formData
function fetchRequest(file, formData) {
  infoText.innerText = "Scanning QR Code...";
  fetch(qrCodeApiUrl, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((result) => {
      result = result[0].symbol[0].data;
      infoText.innerText = result
        ? "Upload QR Code To Scan"
        : "Couldn't Scan QR Code";
      if (!result) return;
      document.querySelector("textarea").innerText = result;
      form.querySelector("img").src = URL.createObjectURL(file);
      wrapper.classList.add("active");
    })
    .catch(() => {
      infoText.innerText = "Couldn't Scan QR Code...";
    });
}

// Upload files
fileInp.addEventListener("change", async (e) => {
  let file = e.target.files[0];
  if (!file) return;
  let formData = new FormData();
  formData.append("file", file);
  fetchRequest(file, formData);
});

// Drag File
form.addEventListener("dragover", (e) => {
  e.preventDefault();
  document.body.classList.add("active");
});

form.addEventListener("dragleave", () => {
  document.body.classList.remove("active");
});

form.addEventListener("drop", (e) => {
  e.preventDefault();
  document.body.classList.remove("active");

  const file = e.dataTransfer.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  fetchRequest(file, formData);
});

// Form-elements Click
form.addEventListener("click", () => fileInp.click());

// Close Button
closeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  wrapper.classList.remove("active");
  fileInp.value = "";
});

// Copy Button
copyBtn.addEventListener("click", () => {
  if (textArea) {
    const textToCopy = textArea.value;
    copyText(textToCopy);
  } else {
    console.error("Textarea not found.");
  }
});

// To copy text to Clipboard
function copyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    alert("텍스트가 클립보드에 복사되었습니다.");
  } catch (error) {
    console.error("복사 오류:", error);
    alert("텍스트 복사에 실패했습니다.");
  }

  document.body.removeChild(textarea);
}