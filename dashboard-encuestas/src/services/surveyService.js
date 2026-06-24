import axios from "axios";

const API = "http://localhost:3000";
export const VOTES_ENDPOINT = `${API}/respuestas`;

export const getVotes = () => axios.get(VOTES_ENDPOINT);
