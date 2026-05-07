// frontend/src/utils/formatDate.js
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"; // ✅ ajout

dayjs.extend(customParseFormat); // ✅ activation du plugin

export function formatDate(dateString) {
  if (!dateString) return "";
  return dayjs(dateString, ["YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY");
}
