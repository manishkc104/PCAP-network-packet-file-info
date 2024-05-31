const API = "http://localhost:3000";

const post = async (url: string, data: any) => {
  return await fetch(url, {
    method: "POST",
    body: data,
  });
};

const put = async (url: string, data: number[]) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

const fetchPackets = async (
  page: number,
  pageSize: number,
  searchTerm: string,
  isFlagged: boolean
) => {
  const response = await fetch(
    `${API}/packets?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}&isFlagged=${isFlagged}`
  );
  const result = await response.json();
  return result;
};

const postFlaggedPackets = async (packets: number[]) => {
  const response = await put(`${API}/packets/flaggedPacket`, packets);
  const result = await response.json();
  return result;
};

const postunFlaggedPackets = async (packets: number[]) => {
  const response = await put(`${API}/packets/unflaggedPacket`, packets);
  const result = await response.json();
  return result;
};

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await post(`${API}/packets/upload`, formData);
  return response;
};

export { uploadFile, fetchPackets, postFlaggedPackets, postunFlaggedPackets };
