/**
 * @param url Absolute or a relative URL to the file.
 * @returns File binary data as a base 64 string.
 */
export async function loadFileContentsAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = function () {
      const dataUrl = reader.result as string;
      const [_, base64Data] = dataUrl.split(";base64,");
      resolve(base64Data);
    };

    reader.onerror = function () {
      reject(reader.error);
    };

    reader.readAsDataURL(blob);
  });
}
