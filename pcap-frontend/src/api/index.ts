const API = "http://localhost:3000";

const post = async (url: string, data: any) => {
  return await fetch(url, {
    method: "POST",
    body: data,
  });
};

const fetchPackets = async (
  page: number,
  pageSize: number,
  searchTerm: string
) => {
  const response = await fetch(
    `${API}/packets?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}`
  );
  const result = await response.json();
  return result;
};

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await post(`${API}/packets/upload`, formData);
  return response;
};

export { uploadFile, fetchPackets };
