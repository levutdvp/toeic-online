export const convertFileToBase64 = (file?: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Lỗi khi đọc file"));
      }
    };

    reader.onerror = (error) => reject(error);
  });
};
