export default {
  getBase64: file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
      reader.onload = function() {
        return resolve(reader.result);
      };
      reader.onerror = function(error) {
        return reject(error);
      };
    });
  },
  convertDataURIToBinary: dataURI => {
    const BASE64_MARKER = ";base64,";
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  },
  checkFileTypePDF: file => file && file.type === "application/pdf"
};

export const checkEmailValidation = mail =>
  !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(mail);

export const checkPasswordValidation = password => password.length < 4;

export const checkCodeValidation = code => code.length < 4;
