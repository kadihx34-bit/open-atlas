import { useLocation } from "wouter";
import SocialPostEditor from "../components/SocialPostEditor";

export default function Editor() {
  const [, navigate] = useLocation();
  return <SocialPostEditor onBack={() => navigate("/")} />;
}
